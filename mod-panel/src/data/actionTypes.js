export const ACTION_TYPES = [
  { 
    value: 'verbal', 
    label: 'Mündliche Verwarnung', 
    emoji: '🗣️',
    color: 'yellow',
    description: 'Inoffizielle Verwarnung'
  },
  { 
    value: 'warn', 
    label: 'Offizielle Warnung', 
    emoji: '⚠️',
    color: 'orange',
    description: 'Offizielle Warnung mit Protokollierung'
  },
  { 
    value: 'kick', 
    label: 'User Kick', 
    emoji: '👢',
    color: 'red',
    description: 'User vom Server entfernen'
  },
  { 
    value: 'ban_1day', 
    label: '1-Tages Bann', 
    emoji: '🔨',
    color: 'pink',
    description: '24-stündiger Bann'
  },
  { 
    value: 'ban_perma', 
    label: 'Permanenter Bann', 
    emoji: '🚫',
    color: 'purple',
    description: 'Dauerhafter Ausschluss'
  }
]

export const ACTION_REASONS = [
  { value: 'spam', label: '🚯 Spam' },
  { value: 'beleidigung', label: '😠 Beleidigung' },
  { value: 'hassrede', label: '⚡ Hassrede' },
  { value: 'betrug', label: '🎭 Betrug' },
  { value: 'belästigung', label: '🚫 Belästigung' },
  { value: 'sonstiges', label: '📌 Sonstiges' }
]
