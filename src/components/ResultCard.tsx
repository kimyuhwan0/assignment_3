'use client';

import { StockData } from '@/lib/yahoo-finance';
import { calculateTotalScore } from '@/lib/api';

interface ResultCardProps {
  data: StockData[];
}

export function ResultCard({ data }: ResultCardProps) {
  if (!data.length) return null;

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  // 기간별 가격 변화율 계산
  const calculatePeriodChange = (days: number) => {
    if (data.length <= days) return null;
    const startPrice = data[data.length - days - 1].close;
    const endPrice = latestData.close;
    if (!startPrice || !endPrice) return null;
    return ((endPrice - startPrice) / startPrice) * 100;
  };

  // 거래량 변화율 계산
  const calculateVolumeChange = () => {
    if (!latestData.volume || !previousData.volume) return null;
    return ((latestData.volume - previousData.volume) / previousData.volume) * 100;
  };

  const dailyChange = calculatePeriodChange(1);
  const weeklyChange = calculatePeriodChange(5);
  const monthlyChange = calculatePeriodChange(20);
  const yearlyChange = calculatePeriodChange(252);
  const volumeChange = calculateVolumeChange();

  const getSignal = () => {
    const score = calculateTotalScore(data);
    
    if (score >= 13) return { signal: '강한 매수 시그널', emoji: '🔵', color: 'text-blue-500' };
    if (score >= 9) return { signal: '매수 고려 가능', emoji: '🟢', color: 'text-green-500' };
    if (score >= 5) return { signal: '보류/관망', emoji: '⚪', color: 'text-gray-500' };
    if (score >= 0) return { signal: '매수 비추천', emoji: '🟠', color: 'text-orange-500' };
    return { signal: '매도 시그널', emoji: '🔴', color: 'text-red-500' };
  };

  const signal = getSignal();

  const signalDescription: Record<string, string> = {
    '강한 매수 시그널': '이동평균선 완벽 정배열 + 골든크로스 + 거래량 급증',
    '매수 고려 가능': '이동평균선 정배열 + 거래량 증가',
    '보류/관망': '이동평균선 혼합 + 거래량 보통',
    '매수 비추천': '이동평균선 부분 역배열 + 거래량 감소',
    '매도 시그널': '이동평균선 완벽 역배열 + 데드크로스 + 거래량 급감'
  };

  const renderPriceChange = (change: number | null, label: string) => {
    if (change === null) return null;
    return (
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className={`font-semibold ${change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    );
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">매매 신호 분석</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">현재 신호:</span>
          <span className={`font-bold ${signal.color}`}>
            {signal.emoji} {signal.signal}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {signalDescription[signal.signal]}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">현재가</span>
            <span className="font-semibold">{formatPrice(latestData.close)}</span>
          </div>
          {renderPriceChange(dailyChange, '전일대비')}
          {renderPriceChange(weeklyChange, '주간')}
          {renderPriceChange(monthlyChange, '월간')}
          {renderPriceChange(yearlyChange, '연간')}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">거래량</span>
            <div className="text-right">
              <div className="font-semibold">{latestData.volume?.toLocaleString() || 'N/A'}</div>
              {volumeChange !== null && (
                <div className={`text-sm ${volumeChange >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {volumeChange >= 0 ? '+' : ''}{volumeChange.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-4">
          * 이 분석은 참고용이며, 투자 결정에 있어 반드시 추가적인 분석이 필요합니다.
        </div>
      </div>
    </div>
  );
} 