export const Navbar = () => {
  return (
      <div className="navbar navbar-dark bg-dark mb4 px-4">
        <span className="navbar-brand">
        <i className="fas fa-calendar-alt" />
        &nbsp;
        KleeC
      </span>
      <button className="btn btn-outline-danger">
        <i className="fas fa-sign-out-alt"/>
        <span>Salir</span>
      </button>
      </div>
  )
}
