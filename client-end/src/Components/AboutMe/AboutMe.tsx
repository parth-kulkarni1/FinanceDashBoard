// This component contains information about me and what this project is about and why i did it..

import './AboutMe.css'

function About(){
    return(
        <div className='page-container'>

            <div className="d-flex flex-column flex-gap-20 align-items-center p-3 about-page-title-container">

                <div className="d-flex flex-column align-items-center">
                    <h3 className='page-title'>About This Project</h3>
                    <h3>⚡️</h3>
                </div>

                <div className='d-flex align-items-center justify-content-around container-information'>

                    <div className = "d-flex flex-column about-me p-3 text-wrap">
                        <h3>About me</h3>
                        <p className='text-description'>
                            Hi My name is Parth Kulkarni and I am a 2.5 year student studying Bachelor Of Computer Science
                            at RMIT University. I have been an UP Bank customer from the last 8-9 months. 

                            I have a passion in web development and constantly thinking about how i can create solutions to
                            problems in my daily lives.

                        </p>

                    </div>


                    <div className= "d-flex flex-column p-3 why-project-was-created text-wrap">

                        <h3>
                            Why this project was created
                        </h3>

                        <p className='text-description'>
                        Hi My name is Parth Kulkarni and I am a 2.5 year student studying Bachelor Of Computer Science
                            at RMIT University. I have been an UP Bank customer from the last 8-9 months. 

                            I have a passion in web development and constantly thinking about how i can create solutions to
                            problems in my daily lives.
                        </p>

                    </div>

                </div>


                <h3>Is Your Token Information Stored By Me?</h3>


            </div>

        </div>
    )
}

export default About;