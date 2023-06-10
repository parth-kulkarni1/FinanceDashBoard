/* Component that displays monthly detailed categorical information */ 
import React, {useContext, useState} from "react";
import { UpContext } from "Components/Context/UpContext";
import { MonthlyCategoryDetailed, childCategoryType } from "Components/Axios/TypesAxios";
import './MonthlyCategory.css'

import { Card, Metric, Text, Icon, Flex, Button } from "@tremor/react";
import {SlEyeglass, SlHome, SlQuestion} from "react-icons/sl"
import {AiFillCar} from "react-icons/ai"
import {BsPersonFill} from "react-icons/bs"
import { Modal, Pagination } from "react-bootstrap";
import moment from "moment";


function capitalizeFirstWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


const renderImage = (category:string) => (

    <div>
        {category === "transport" ? <Icon icon={AiFillCar} variant="solid" size="lg" color="violet"></Icon> : 
         category === "home" ? <Icon icon={SlHome} variant="solid" size="lg" color = "orange"></Icon> : 
         category === "personal"  ? <Icon icon={BsPersonFill} variant="solid" size="lg"></Icon> :
         category === "good-life" ? <Icon icon={SlEyeglass} variant="solid" size="lg" color="yellow"></Icon> :
         <Icon icon={SlQuestion} variant="solid" size = "lg"></Icon>}
    </div>
)


function CategoryInsight(){

    const {state} = useContext(UpContext)
    const [show, setShow] = useState<boolean>(false);
    const [showModal2, setShowModal2] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6

    const [currentCategory, setCurrentCategory] = useState<MonthlyCategoryDetailed | null> (null);
    const [currentCategoryModal2, setCurrentCategoryModal2] = useState<childCategoryType | null> (null);
    const [totalPages, setTotalPages] = useState<number>(0);


    const handleClose = () => setShow(false);
    const handleCloseModal2 = () => {
        setShowModal2(false)
        setCurrentPage(1)
    }


    function handleCategoryDisplay(event: React.FormEvent<HTMLButtonElement>){

        const currentIndex = parseInt(event.currentTarget.value)

        setCurrentCategory(state.monthCategoryDetailedInfo[currentIndex])

        setShow(true)

    }

    function handleModal2Display(event: React.FormEvent<HTMLButtonElement>){
        const currentIndex = parseInt(event.currentTarget.value)

        const currentChildItem = currentCategory.childCategory[currentIndex]

        setCurrentCategoryModal2(currentChildItem)

        setTotalPages(Math.ceil(currentChildItem.transaction.length / itemsPerPage))

        setShow(false)

        setShowModal2(true)

    }

    return(

        <div className="category-container">

            <h3 className="text-center mt-2 p-3">Categorical Spending Insights</h3>

            <div className="category-labels-container">

                {state.monthCategoryDetailedInfo.map((category, index) => (
                
                        <Card  maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">
                        <div key={index}> 
                                <div className="d-flex justify-content-end">
                                    <Button value={index} onClick={handleCategoryDisplay}>View More</Button>
                                </div>
                                <div className="p-3">
                                    <Flex spaceX="space-x-1">
                                        {renderImage(category.parentCategory)}
                                        <div>
                                            <Metric>{capitalizeFirstWord(category.parentCategory)}</Metric>
                                        <Text>No Of Transactions: {category.childCategory.length}</Text>
                                        </div>
                                    </Flex>
                                </div> 
                            </div>                

                        </Card>  

                ))}

            
                {currentCategory && show && 
                                                    
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <Modal show = {show} onHide= {handleClose} centered>
                            <Modal.Header closeButton>
                                <div className="d-flex flex-column justify-content-center align-items-center w-100">
                                    {renderImage(currentCategory.parentCategory)}
                                    <Modal.Title className="text-center">{capitalizeFirstWord(currentCategory.parentCategory)}</Modal.Title>
                                </div>
                            </Modal.Header>

                            <Modal.Body>
                                {currentCategory.childCategory.map((childItem, index) => (
                                    
                                    <Flex  marginTop="mt-5">
                                    <Card>
                                        <div className="d-flex justify-content-end">
                                            <Button value={index} onClick={handleModal2Display}>View More</Button>
                                        </div>

                                        <div className="d-flex flex-column">
                                            <Metric>{capitalizeFirstWord(childItem.categoryName)}</Metric>
                                            <Text>No Of Transactions: {childItem.transaction.length}</Text>
                                        </div>
                                    </Card>

                                    </Flex>
                                    

                                ))}
                            </Modal.Body>

                        </Modal>

                    </div>
                }


                {currentCategoryModal2 && showModal2 && 
                    
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <Modal show = {showModal2} onHide= {handleCloseModal2} centered>
                            <Modal.Header closeButton>

                                <Modal.Title>{capitalizeFirstWord(currentCategoryModal2.categoryName)}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>

                                <div className="d-flex flex-gap-5 flex-column align-items-center">

                                {currentCategoryModal2.transaction
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((transaction) => (

                                    <Flex marginTop="mt-3">
                                    <Card>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex">
                                                <Text>Date: {moment(transaction.attributes.createdAt).format('LLL')}</Text>
                                            </div>

                                            <div className="d-flex flex-column">
                                                <div className="d-flex justify-content-between">
                                                    <Text>Company: {transaction.attributes.description}</Text>
                                                    <Text>${Math.abs(parseFloat(transaction.attributes.amount.value)).toFixed(2)}</Text>
                                                </div>
                                                <Text>Location: {transaction.attributes.rawText}</Text>
                                            </div>
                                        
                                        </div>

                                    </Card>

                                    </Flex>


                                ))}

                                {totalPages > 1 && (
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled = {currentPage === 1}
                                        />
                                        {Array.from({length:totalPages}, (_, index) => (
                                            <Pagination.Item
                                                key = {index + 1}
                                                active = {index + 1 === currentPage}
                                                onClick = {() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}

                                        <Pagination.Next
                                            onClick = {() => setCurrentPage(currentPage + 1)}
                                            disabled = {currentPage === totalPages}
                                        />

                                    </Pagination>
                                )}

                                </div>



                            </Modal.Body>

                        </Modal>

                    </div>
                    
                }


                <p>*Represents Your Categorical Spending Across The Month</p>
            
            </div>
        </div>
    )}

export default CategoryInsight;