'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EngagementTimeHeatmapData, EngagementTimeSlot } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, Clock, TrendingUp, Activity } from 'lucide-react';

interface EngagementTimeHeatmapProps {
  data: EngagementTimeHeatmapData;
  className?: string;
}

export default function EngagementTimeHeatmap({ data, className }: EngagementTimeHeatmapProps) {
  const [viewMode, setViewMode] = useState<'absolute' | 'normalized'>('normalized');
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create a matrix for the heatmap
  const createHeatmapMatrix = () => {
    const matrix: Array<Array<EngagementTimeSlot | null>> = Array(7).fill(null).map(() => Array(24).fill(null));
    
    data.timeSlots.forEach(slot => {
      matrix[slot.dayOfWeek][slot.hour] = slot;
    });
    
    return matrix;
  };

  const heatmapMatrix = createHeatmapMatrix();

  // Get the maximum engagement count for absolute view
  const maxEngagement = Math.max(...data.timeSlots.map(slot => slot.engagementCount));

  // Get intensity for a cell based on view mode
  const getCellIntensity = (slot: EngagementTimeSlot | null) => {
    if (!slot) return 0;
    return viewMode === 'normalized' ? slot.intensity : slot.engagementCount / maxEngagement;
  };

  // Get background color based on intensity
  const getCellColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-50 dark:bg-slate-800/50';
    if (intensity < 0.2) return 'bg-blue-100 dark:bg-blue-950/50';
    if (intensity < 0.4) return 'bg-blue-200 dark:bg-blue-900/60';
    if (intensity < 0.6) return 'bg-blue-300 dark:bg-blue-800/70';
    if (intensity < 0.8) return 'bg-blue-400 dark:bg-blue-700/80';
    return 'bg-blue-500 dark:bg-blue-600';
  };

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Get hovered cell data
  const hoveredData = hoveredCell 
    ? heatmapMatrix[hoveredCell.day][hoveredCell.hour]
    : null;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Engagement Time Heatmap</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'normalized' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('normalized')}
            >
              Normalized
            </Button>
            <Button
              variant={viewMode === 'absolute' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('absolute')}
            >
              Absolute
            </Button>
          </div>
        </div>
        <CardDescription>
          User engagement patterns by day of week and hour of day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Engagements</p>
                <p className="text-xl font-bold">{data.totalEngagements.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Peak Hour</p>
                <p className="text-xl font-bold">
                  {formatHour(data.peakHours[0]?.hour || 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Peak Day</p>
                <p className="text-xl font-bold">
                  {data.peakDays[0]?.dayName || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="relative">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Hour labels */}
                <div className="flex ml-12">
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className="flex-1 text-xs text-center text-slate-500 mb-2 px-1"
                    >
                      {hour % 6 === 0 ? formatHour(hour) : hour % 3 === 0 ? hour : ''}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {days.map((day, dayIndex) => (
                  <div key={day} className="flex items-center mb-1">
                    {/* Day label */}
                    <div className="w-10 text-xs font-medium text-slate-600 dark:text-slate-400 text-right mr-2">
                      {day}
                    </div>
                    
                    {/* Hour cells */}
                    <div className="flex flex-1">
                      {hours.map(hour => {
                        const slot = heatmapMatrix[dayIndex][hour];
                        const intensity = getCellIntensity(slot);
                        
                        return (
                          <div
                            key={`${dayIndex}-${hour}`}
                            className={cn(
                              "flex-1 aspect-square border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:scale-110 rounded-sm",
                              getCellColor(intensity),
                              hoveredCell?.day === dayIndex && hoveredCell?.hour === hour && "ring-2 ring-blue-400 scale-110"
                            )}
                            onMouseEnter={() => setHoveredCell({ day: dayIndex, hour })}
                            onMouseLeave={() => setHoveredCell(null)}
                            title={slot ? `${day} ${formatHour(hour)}: ${slot.engagementCount} engagements` : `${day} ${formatHour(hour)}: No data`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip */}
            {hoveredCell && hoveredData && (
              <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg z-10 min-w-[200px]">
                <div className="space-y-2">
                  <div className="font-medium">
                    {days[hoveredCell.day]} {formatHour(hoveredCell.hour)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div>Engagements: <span className="font-medium">{hoveredData.engagementCount}</span></div>
                    <div>Intensity: <span className="font-medium">{(hoveredData.intensity * 100).toFixed(1)}%</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Less</span>
              <div className="flex space-x-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                  <div
                    key={index}
                    className={cn("w-3 h-3 rounded-sm", getCellColor(intensity))}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">More</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                {data.dateRange.start} - {data.dateRange.end}
              </Badge>
              <span className="text-xs text-slate-500">
                Last updated: {data.lastUpdated.split('T')[0]}
              </span>
            </div>
          </div>

          {/* Peak Times Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Peak Hours
              </h4>
              <div className="space-y-1">
                {data.peakHours.slice(0, 3).map((peak) => (
                  <div key={peak.hour} className="flex justify-between text-sm">
                    <span>{formatHour(peak.hour)}</span>
                    <span className="font-medium">{peak.count} engagements</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                Peak Days
              </h4>
              <div className="space-y-1">
                {data.peakDays.slice(0, 3).map((peak) => (
                  <div key={peak.dayOfWeek} className="flex justify-between text-sm">
                    <span>{peak.dayName}</span>
                    <span className="font-medium">{peak.count} engagements</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
