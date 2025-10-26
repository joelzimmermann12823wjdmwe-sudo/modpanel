import Card from '@/components/ui/Card'
import { ACTION_TYPES } from '@/data/actionTypes'

export default function ActionCard({ action }) {
  const getActionInfo = (actionType) => {
    return ACTION_TYPES.find(a => a.value === actionType) || {}
  }

  const actionInfo = getActionInfo(action.actionType)

  return (
    <Card className="border-l-4" style={{ borderLeftColor: `var(--color-${actionInfo.color})` }}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-semibold">{actionInfo.label}</span>
          <h3 className="text-lg font-bold mt-1">{action.username}</h3>
          <p className="text-gray-600">{action.reason}</p>
          {action.notes && (
            <p className="text-gray-500 text-sm mt-2">{action.notes}</p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Mod: {action.moderator}</div>
          <div>{new Date(action.timestamp).toLocaleDateString('de-DE')}</div>
        </div>
      </div>
    </Card>
  )
}
