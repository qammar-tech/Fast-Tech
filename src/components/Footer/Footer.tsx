import React from 'react'
import "./footer.css"


import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Social Media</h3>
                            <div className="social-icons">
                                {/* Replace the placeholder links and icons with your social media icons */}
                                <a href="#" className="icon-link hover:text-lime-600">
                                    <CiFacebook />
                                </a>
                                <a href="#" className="icon-link hover:text-lime-600">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="icon-link">
                                    <i className="fab fa-instagram" />
                                </a>
                                {/* Add more social media icons as needed */}
                            </div>
                        </div>

                        <div className="footer-section">
                            <h3>Contact</h3>
                            <p>Email: contact@example.com</p>
                            <p>Phone: 123-456-7890</p>
                            <p>Address: Brickell
                                97 SW 8th St
                                Miami, FL 33130</p>
                            {/* Add more contact information if necessary */}
                        </div>

                        <div className="footer-section">
                            <h3>Pages</h3>
                            <ul className="footer-links cursor-pointer">
                                <li>
                                    <a className="cursor-pointer text-gray-300 hover:text-lime-600 hover:border-b-[1px]" href="#">Home</a>
                                </li>
                                <li>
                                    <a className="cursor-pointer text-gray-300 hover:text-lime-600 hover:border-b-[1px]" href="#">Catering</a>
                                </li>
                                <li>
                                    <a className="cursor-pointer text-gray-300 hover:text-lime-600 hover:border-b-[1px]" href="#">Gift Cards</a>
                                </li>
                                <li>
                                    <a className="cursor-pointer text-gray-300 hover:text-lime-600 hover:border-b-[1px]" href="#">Check Gift Card Balance</a>
                                </li>
                                {/* Add more page links as needed */}
                            </ul>
                        </div>

                    </div>
                    <div className="footer-section  flex p-2 border-b-[1px] justify-between flex ">
                        <div className="container-fluid">

                        <div className="row ">

                        <div className="col-md-6   col-sm-12">
                        <div className="footer-section flex">

                            <div className="w-f ">

                                <h3 className="cursor-pointer text-gray-100">Areas Served</h3>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Miami</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Jacksonville Beach</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">hover:text-lime-600</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Holden Heights</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Coral Springs</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Edgewood</p>
                                {/* Add more served areas or keywords */}
                            </div>
                            <div className="w-f">
                                {/* <h3 className="cursor-pointer  text-gray-100 hover:text-lime-600 "></h3> */}
                                <p className="cursor-pointer mt-4 p-1 text-gray-200 hover:text-lime-600 ">Neptune Beach</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Doral</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Allapattah</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Orlando</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Coral Springs</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Wellington</p>
                                {/* Add more served areas or keywords */}
                            </div>
                            <div className="w-f">
                                {/* <h3 className="cursor-pointer  text-gray-100 hover:text-lime-600 "></h3> */}
                                <p className="cursor-pointer mt-4 p-1 text-gray-200 hover:text-lime-600 ">Country Club</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Pine Castle</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Brookhaven</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Conway</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Brownsville</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Edgewood</p>
                                {/* Add more served areas or keywords */}
                            </div>
                        </div>

                        </div>


                        <div className="col-md-6  col-sm-12 ">


                        <div className="footer-section  justify-end  mr-40 flex">



                            <div className="w-f ">

                                <h3 className="cursor-pointer text-gray-100">Keywords</h3>
                                <p className="cursor-pointer  text-gray-200 hover:text-lime-600 ">Tacos</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Mexican</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Birria Tacos</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Holden Heights</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Nachos</p>
                                <p className="cursor-pointer text-gray-200 hover:text-lime-600 ">Mexican Restaurant</p>
                                {/* Add more served areas or keywords */}
                            </div>


                        </div>
                        </div>

                        </div>

                        </div>

                    </div>
                </div>
            </footer>


        </>
    )
}

export default Footer
