// Contains the component that renders a modal enables user to add up to 6 to their respective transaction

import React, {useState, useContext, useEffect} from "react"
import { UpContext } from "Components/Context/UpContext";
import { addTagsToTransaction } from "Components/Axios/AxiosCommands";

import { Button, Form, Modal } from "react-bootstrap";
import { RelationshipData, TransactionResource } from "up-bank-api";

function AddTag(){

    const {state, dispatch} = useContext(UpContext)

    const [input, setInput] = useState<string>('')

    useEffect(() => {

        // Refreshes the component

    }, [state.transactionIndividual])



    function handleModalClose(){
        dispatch({type:"addTag", payload: {setTags: false, tagPayload: null}})
        setInput('')

    }

    async function handleAddTag(event: React.FormEvent<HTMLFormElement>){

        event.preventDefault();

        const tagObj: RelationshipData<"tags"> = {
            type: "tags", // Make sure the type matches the expected type "tags"
            id: input
          };

        const postObj = {transactionId: state.transactionIndividual.id, tags: tagObj}

        // Make api call that adds the post Obj 


        const response = await addTagsToTransaction(postObj)

        if(response.status === 204){

            console.log("triggered 204")

            const updatedTransaction: TransactionResource = { ...state.transactionIndividual };
            updatedTransaction.relationships.tags.data.push(tagObj);

            dispatch({type: 'updateTags', payload: updatedTransaction})

        }

        else{
            console.log("Failed to add Tag")

        }

    }


    return(

        <div>
            {state.addTag.setTags && 

                <Modal show = {state.addTag.setTags} onHide={handleModalClose} centered >

                    <Modal.Header>
                        <Modal.Title>
                            Add/Remove Tags.
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        {
                            state.addTag.tagPayload.relationships.tags.data.length ?
                                state.addTag.tagPayload.relationships.tags.data.map((tag) => (
                                    <p>{tag.id}</p>
                                ))

                            : 
                                <p>No tags to show for this transaction</p>

                        }

                        {state.addTag.tagPayload.relationships.tags.data.length <=6 ? 

                            <div>
                                    
                                <Form onSubmit={handleAddTag}>
                                    <Form.Group className="mb-3" controlId = "tagInput">
                                        <Form.Control onChange={(e) => {setInput(e.target.value)}} type = "input" placeholder="Add a Tag Here" />
                                    </Form.Group>

                                    <div className="d-flex justify-content-end pr-3">

                                        {input.length > 50  ? <p className="text-red">{input.length}/50 </p>: <p> {input.length}/50 </p>}

                                    </div>
                                    


                                    <Button type = "submit" disabled = {input.length === 0 || input.length > 50}>Submit Tag</Button>


                                </Form>

                            </div>

                            :

                            <p>You need to remove a tag, to add more tags!</p>
                            

                        }

                    </Modal.Body>


                </Modal>


            }
        </div>
        
    )


}


export default AddTag;