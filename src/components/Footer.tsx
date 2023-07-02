

const Footer = () => {

    return (
        <footer>
            <hr />
            <p className="text-muted text-center pt-5">
                &copy;{new Date().getFullYear()}&nbsp;The New York Times Company.  All Rights Reserved.
            </p>
            <p className="text-muted text-center pb-5">Developed by DJ with 
                <span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/240px-React-icon.svg.png" alt="React Icon" width={16} height={16}/>
                    &
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1024px-Typescript_logo_2020.svg.png?20221110153201" alt="TypeScript Icon" width={16} height={16}/>
                    &
                    🔥
                </span>
            </p>
        </footer>
    )
}

export default Footer
