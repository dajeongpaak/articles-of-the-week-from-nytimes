
type HeaderProps = {
  projectName: string
  title: string
}

const Header = ( { title, projectName }:HeaderProps) => {
  return (
    <header>
        <div className="container-lg">
            <div className="d-flex justify-content-between mt-3">
                <p className="h6">{ projectName }</p>
            </div>
            <hr />
            <h1 className="display-4 text-left pt-5 pb-5">
                { title }
            </h1>
            <hr />
        </div>
    </header>
  )
}

export default Header

