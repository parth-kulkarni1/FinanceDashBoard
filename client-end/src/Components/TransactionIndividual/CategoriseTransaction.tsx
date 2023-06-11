import React, {useState, useEffect, useContext} from "react"
import { UpContext } from "Components/Context/UpContext";

import { getCategories } from "Components/Axios/AxiosCommands";
import { categoryList } from "Components/Axios/TypesAxios";

function CategoriseTransaction(){

    const {state, dispatch} = useContext(UpContext);
    const currentTransactionCategory = state.transactionIndividual.relationships.category.data.id

    console.log(currentTransactionCategory)


    const [categoriesList, setCategoriesList] = useState<categoryList[] | null>(null);

    useEffect(() => {

        async function fetchCategories(){

            const data = await getCategories();
            setCategoriesList(data)

        }

        fetchCategories()

    }, [])

    return(
        <div>

            {categoriesList?.map((category) => (

                <div>  
                    <h3>{category.parentCategory}</h3>
                    
                    {category.childCategory.map((childCategory) => (

                        <div>

                            {childCategory.id === currentTransactionCategory ? <p>{childCategory.name} - THIS IS SELECTED</p>
                            
                            :
                            <p>{childCategory.name}</p>
                        
                            }

                        </div>

                    ))}

                </div>
                ))}
            
        </div>
    )


}

export default CategoriseTransaction;