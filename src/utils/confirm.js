import { Alert, Platform } from 'react-native';

// O Alert.alert do react-native-web não renderiza múltiplos botões nem chama os
// callbacks — no navegador ele vira um window.alert simples. Estes helpers
// garantem o comportamento correto tanto no nativo quanto no web/PWA.

export function confirmAction({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(message || title)) {
      onConfirm?.();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

// Aviso informativo com um único botão; garante que onDismiss rode nas duas
// plataformas (no web o callback do Alert.alert não dispara).
export function notify(title, message, onDismiss) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message ? `${title}\n\n${message}` : title);
    onDismiss?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'OK', onPress: onDismiss }]);
}
