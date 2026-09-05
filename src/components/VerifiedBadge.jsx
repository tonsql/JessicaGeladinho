import { CheckIcon } from './Icons'

export default function VerifiedBadge() {
  return (
    <div className="verified-badge" title="Jessica Gourmet — loja verificada">
      <span><CheckIcon /></span>
      <div><strong>Verificado</strong><small>Jessica Gourmet</small></div>
    </div>
  )
}
