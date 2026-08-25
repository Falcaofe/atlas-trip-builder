export default function Header({ saved }) {
  return (
    <header className="topbar">
      <a href="#inicio" className="logo">
        ATLAS<span>●</span>
      </a>

      <div className="topbar-right">
        <span className="saved-label">
          {saved ? 'viagem salva no navegador' : 'planeje sem pressa'}
        </span>
        <a className="saved-btn" href="#builder">Criar viagem</a>
      </div>
    </header>
  )
}
