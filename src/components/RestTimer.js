import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme/colors';

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Cronômetro de descanso entre séries. Auto-inicia quando `startSignal` muda.
export default function RestTimer({ defaultSeconds = 90, startSignal = 0 }) {
  const [duration, setDuration] = useState(defaultSeconds);
  const [secondsLeft, setSecondsLeft] = useState(null); // null = parado
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  const endRef = useRef(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Atualiza a duração padrão quando o perfil carrega (só se estiver parado).
  useEffect(() => {
    if (secondsLeft === null) setDuration(defaultSeconds);
  }, [defaultSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-inicia ao adicionar uma série.
  useEffect(() => {
    if (startSignal > 0) start(duration);
  }, [startSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimer(), []);

  function clearTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function ensureAudio() {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioRef.current) audioRef.current = new AC();
      if (audioRef.current.state === 'suspended') audioRef.current.resume();
    } catch {}
  }

  function start(sec) {
    clearTimer();
    ensureAudio(); // criado no gesto do usuário, libera o beep no fim
    setDone(false);
    setPaused(false);
    endRef.current = Date.now() + sec * 1000;
    setSecondsLeft(sec);
    intervalRef.current = setInterval(tick, 250);
  }

  function tick() {
    const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
    setSecondsLeft(left);
    if (left <= 0) finish();
  }

  function finish() {
    clearTimer();
    setSecondsLeft(0);
    setDone(true);
    alertDone();
    setTimeout(() => {
      setSecondsLeft(null);
      setDone(false);
    }, 4000);
  }

  function stop() {
    clearTimer();
    setSecondsLeft(null);
    setPaused(false);
    setDone(false);
  }

  function togglePause() {
    if (secondsLeft === null) return;
    if (paused) {
      endRef.current = Date.now() + secondsLeft * 1000;
      intervalRef.current = setInterval(tick, 250);
      setPaused(false);
    } else {
      clearTimer();
      setPaused(true);
    }
  }

  function adjust(delta) {
    if (secondsLeft === null) {
      setDuration((d) => Math.max(15, d + delta));
    } else {
      endRef.current += delta * 1000;
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
    }
  }

  function alertDone() {
    try {
      if (Platform.OS === 'web') {
        const ctx = audioRef.current;
        if (ctx) {
          const beep = (t, freq) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
            o.start(t);
            o.stop(t + 0.3);
          };
          const now = ctx.currentTime;
          beep(now, 880);
          beep(now + 0.35, 1175);
        }
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([180, 90, 180]);
      } else {
        Vibration.vibrate([0, 180, 90, 180]);
      }
    } catch {}
  }

  const idle = secondsLeft === null;

  return (
    <View style={[styles.bar, done && styles.barDone]}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'timer-outline'}
        size={22}
        color={done ? colors.primary : colors.accent}
      />

      {idle ? (
        <>
          <Text style={styles.label}>Descanso</Text>
          <View style={styles.controls}>
            <StepBtn icon="remove" onPress={() => adjust(-15)} />
            <Text style={styles.time}>{fmt(duration)}</Text>
            <StepBtn icon="add" onPress={() => adjust(15)} />
            <Pressable style={styles.startBtn} onPress={() => start(duration)}>
              <Text style={styles.startText}>Iniciar</Text>
            </Pressable>
          </View>
        </>
      ) : done ? (
        <Text style={styles.doneText}>Descanso concluído! 💪</Text>
      ) : (
        <>
          <Text style={styles.timeBig}>{fmt(secondsLeft)}</Text>
          <View style={styles.controls}>
            <StepBtn icon="remove" onPress={() => adjust(-15)} />
            <StepBtn icon={paused ? 'play' : 'pause'} onPress={togglePause} />
            <StepBtn icon="add" onPress={() => adjust(15)} />
            <Pressable style={styles.stopBtn} onPress={stop}>
              <Ionicons name="stop" size={16} color={colors.text} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function StepBtn({ icon, onPress }) {
  return (
    <Pressable style={styles.stepBtn} onPress={onPress} hitSlop={6}>
      <Ionicons name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  barDone: { borderColor: colors.primary },
  label: { color: colors.textMuted, fontSize: 14, fontWeight: '600', flex: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  time: { color: colors.text, fontSize: 15, fontWeight: '700', minWidth: 44, textAlign: 'center' },
  timeBig: { color: colors.text, fontSize: 22, fontWeight: '800', flex: 1, fontVariant: ['tabular-nums'] },
  doneText: { color: colors.primary, fontSize: 15, fontWeight: '700', flex: 1 },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  startText: { color: colors.background, fontWeight: '700', fontSize: 13 },
  stopBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
