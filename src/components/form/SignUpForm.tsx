import { useState } from "react"
import Modal from "../modal/SignUpModal"
import {
    SignUpFormPropTypes,
} from '../../types/types'


const SignUpForm = ({ title, subtitle }:SignUpFormPropTypes) => {
    const [email, setEmail] = useState<string>('')
    const [isSignup, setIsSignup] =useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(true)

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
       
        e.preventDefault();
        try {
            const requestOption = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mail: email })
            }

            const response = await fetch('/signup', requestOption)

            if(response.ok) {
                setIsSignup(true)
                setIsSuccess(true)
            } else if ( response.status >= 400 && response.status < 600 ){
                setIsSignup(true)
                setIsSuccess(false)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setEmail(value)
    }


  return (
    <div className="container-lg">
        <hr />
        <h3 className="display-5 text-left pt-5 ">
            { title }
        </h3>
        <h4 className="h5 pb-5">
            { subtitle }
        </h4>
        <div className="col-xl-4 col-md-6">
            <form 
                className="pb-5" 
                onSubmit={handleSubmit}
            >
                <div className="mb-3">
                    <label 
                        htmlFor="inputEmail"    
                        className="form-label"
                        >Email address
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        id="inputEmail" 
                        aria-describedby="emailHelp" 
                        onChange={handleEmailChange}
                        required
                    />
                    <div 
                        id="emailHelp" 
                        className="form-text"
                    >We'll never share your email with anyone else.
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          <Modal 
            open={isSignup}
            handleClick={() => setIsSignup(false)}
            title={ isSuccess ? (
                <span>
                    You're subscribed
                </span>
            ) : (
                <span>
                    Failed to subscribe
                </span>
            )}
            content={ isSuccess ? (
                <span>
                    Woohoo 🎉, <br /> 
                    You have successfully signed up for the weekly newsletter! <br />
                    You will receive newsletters every Sunday. See you soon!
                </span>
            ) : ( 
                <span>
                Uh-oh Something went worng. <br />Please try it again. 
                </span>
            )}
            />
        </div>
    </div>
  )
}

export default SignUpForm
