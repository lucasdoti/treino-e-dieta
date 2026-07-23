import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors, spacing } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Gráfico de linha simples, sem dependências externas de chart.
// points: [{ label: string, value: number }], em ordem cronológica.
export default function LineChart({
  points,
  height = 180,
  color = colors.primary,
  targetValue,
  emptyMessage = 'Sem dados ainda.',
}) {
  const width = SCREEN_WIDTH - spacing.md * 4;
  const paddingH = 12;
  const paddingV = 16;

  if (!points || points.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const values = points.map((p) => p.value);
  const allValues = targetValue ? [...values, targetValue] : values;
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const usableWidth = width - paddingH * 2;
  const usableHeight = height - paddingV * 2;

  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = paddingH + i * stepX;
    const y = paddingV + usableHeight - ((p.value - minValue) / range) * usableHeight;
    return { x, y, value: p.value };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const targetY = targetValue
    ? paddingV + usableHeight - ((targetValue - minValue) / range) * usableHeight
    : null;

  return (
    <View>
      <Svg width={width} height={height}>
        {targetY !== null && (
          <Line
            x1={paddingH}
            y1={targetY}
            x2={width - paddingH}
            y2={targetY}
            stroke={colors.warning}
            strokeDasharray="4,4"
            strokeWidth={1}
          />
        )}
        <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} />
        {coords.map((c, i) => (
          <Circle key={i} cx={c.x} cy={c.y} r={3.5} fill={color} />
        ))}
        <SvgText x={paddingH} y={height - 2} fill={colors.textFaint} fontSize={11}>
          {points[0].label}
        </SvgText>
        <SvgText
          x={width - paddingH}
          y={height - 2}
          fill={colors.textFaint}
          fontSize={11}
          textAnchor="end"
        >
          {points[points.length - 1].label}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textFaint, fontSize: 13 },
});
