// This component contains information about me and what this project is about and why i did it..

import { Icon } from '@tremor/react';
import { SlSocialGithub } from "react-icons/sl";

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

                        

                        <h3>Is Your Token Information Stored By Me?</h3>

                        <p className='text-description'>
                            No, your token information is not stored by me. The token information is simply stored in the express server and is
                            not sent to anyone or any database. For your own satisfaction, you can check my github code.
                        </p>

                    </div>


                    <div className= "d-flex flex-column p-3 why-project-was-created text-wrap">

                        <h3>
                            Why this project was created
                        </h3>

                        <p className='text-description'>
                            This project was created simply out of one reason. That is that UP-Bank does not have a desktop app
                            and only have a mobile app. I thought why not, let's create an unofficial desktop app using the UP-Bank API.

                            I have utilized the API to display information and model the data that is returned by the API response in my express
                            backend and send that off to my react-front end.

                        </p>

                        <h3>How can i report a bug/new idea?</h3>

                        <p className='text-description'>
                            To report a new bug or an idea go to the github repository and create a new issue there. If you want to suggest me an idea that is 
                            reasonably possible using the API, hit me up at parthivskill@gmail.com.
                        </p>


                    </div>

                </div>

                <h3>Links to Github: </h3>

                <div className='d-flex align-items-center'>
                    <Icon icon={SlSocialGithub}  size='lg' />

                    <a target='_blank' href='https://github.com/parth-kulkarni1/FinanceDashBoard' rel="noreferrer"><p className='text-description'>Personal Github</p></a>
                </div>


            </div>

        </div>
    )
}

export default About;