import React, {useState, useEffect, useContext} from "react"
import { UpContext } from "Components/Context/UpContext";
import { getCategories, categoriseTransaction, logout } from "Components/Axios/AxiosCommands";
import { categoryList } from "Components/Axios/TypesAxios";
import { useNavigate } from "react-router-dom";
import { userContext } from "Components/Context/UserContext";


import { Card, Metric, Divider, Button } from "@tremor/react";
import { Form } from "react-bootstrap";

function CategoriseTransaction(){

    const {state, dispatch} = useContext(UpContext);
    const {setUser} = useContext(userContext);
    const navigate = useNavigate();

    useEffect(() => {

        async function fetchCategories(){

            const data = await getCategories();
            setCategoriesList(data)

        }

        if(state.transactionIndividual === null){
            navigate('/dashboard')
        }

        else{
            fetchCategories()
        }

    }, [navigate, setUser, state.transactionIndividual])

    const currentTransactionCategory = state.transactionIndividual.relationships.category.data.id

    const [searchInput, setSearchInput] = useState<string>('')
    const [categoriesList, setCategoriesList] = useState<categoryList[] | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<categoryList[] | null>(null);
    
    useEffect(() => {
        if (categoriesList) {
          // Filter the categories based on the search input
          const filtered = categoriesList.filter((category) =>
            category.parentCategory?.toLowerCase().includes(searchInput.toLowerCase()) ||
            category.childCategory.some((childCategory) =>
              childCategory.name.toLowerCase().includes(searchInput.toLowerCase())
            )
          );
          setFilteredCategories(filtered);
        }
      }, [searchInput, categoriesList]);
      
    function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>){

        let currentText = event.target.value

        setSearchInput(currentText)

    }

    async function handleCategoryChange(event: React.FormEvent<HTMLButtonElement>){

        const currentCategoryID = event.currentTarget.value
        const postObj = {transactionId: state.transactionIndividual.id, category: {type: "categories", id: currentCategoryID}}

        const response = await categoriseTransaction(postObj)

        if(response.status === 204){
            // Call dispatch method to update the category  

            const updatedTransaction = {...state.transactionIndividual}

            updatedTransaction.relationships.category.data.id = currentCategoryID

            dispatch({type: 'updateCategory', payload: updatedTransaction})

        }

        else{
            console.log("Something has gone wrong...")
        }



    }

    // Check if transactionIndividual is null before rendering JSX
    if (!state.transactionIndividual) {
        return null;
    }

    return(
        <div>

            <div className="d-flex flex-column align-items-center flex-gap-20">

                <div>
                    <h3>Change Category</h3>
                </div>

                <div>
                    <Form>
                        <Form.Group className="d-flex flex-gap-20">
                            <Form.Control type = "search"
                                         placeholder="Search Categories"
                                         aria-label="Search"
                                         onChange={handleSearchInput}
                                         ></Form.Control>
                        </Form.Group>
                    </Form>
                </div>

            </div>

            {filteredCategories?.map((category) => (

                <div className="p-3">  

                    <Metric>{category.parentCategory}</Metric>

                    <Card>
                    
                    {category.childCategory.map((childCategory) => (

                        <div>

                            <div className="d-flex justify-content-between">

                                <div>
                                    <h6>{childCategory.name}</h6>
                                </div>

                                <div>

                                    {childCategory.id === currentTransactionCategory ?
                                        <Button disabled>Current Selected Category</Button>
                                        :
                                        <Button onClick={handleCategoryChange} value={childCategory.id}>Change To This Category </Button>
                                    }
                                </div>

                            </div>

                            <Divider/>

                        </div>

                    ))}

                    </Card>


                </div>
                ))}
            
        </div>
    )


}

export default CategoriseTransaction;