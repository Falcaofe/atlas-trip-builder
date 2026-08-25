export default function Hero() {
  return (
    <section className="intro" id="inicio">
      <div className="intro-copy">
        <div className="edition">PROJETO DE ESTUDOS / REACT</div>

        <h1>
          PARA ONDE
          <br />
          <em>VAMOS?</em>
        </h1>

        <p>
          Monte uma viagem do seu jeito. O Atlas foi criado para praticar React em um fluxo de planejamento de viagem.
          Ao escolher um destino, o projeto consulta a Open-Meteo para mostrar
          informações de clima e previsão do tempo.
        </p>

        <a className="primary" href="#builder">
          Criar minha viagem <span>↗</span>
        </a>

        <div className="tech-strip">
          <span>REACT</span>
          <span>API</span>
          <span>LOCALSTORAGE</span>
        </div>
      </div>

      <div className="intro-art">
        <div className="sun"></div>

        <div className="passport">
          <span>ATLAS</span>
          <strong>TRAVEL<br />PASS</strong>
          <small>REACT / API / GO</small>
        </div>

        <div className="photo photo-a">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=85"
            alt="Paris"
          />
          <span>48.8566° N</span>
        </div>

        <div className="photo photo-b">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=85"
            alt="Kyoto"
          />
        </div>

        <div className="route-line">✈︎ · · · · · · · · · · ·</div>
        <div className="stamp">OPEN<br />METEO</div>
      </div>
    </section>
  )
}
