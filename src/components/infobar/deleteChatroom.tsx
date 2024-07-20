import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { deleteChatRoom } from "@/hooks/conversation/use-conversation";

type Props = {
  id: string;
};
export const DeleteChatroom = async (id: string): Promise<JSX.Element> => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const chatRoom = await deleteChatRoom(id);
      console.log(chatRoom);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShowModal}>
        Delete Chatroom
      </Button>
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header>
          <Modal.Title>Delete Chatroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this chatroom and all its messages?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
