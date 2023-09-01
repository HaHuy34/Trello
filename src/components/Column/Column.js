import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import { Button, Dropdown, Form } from "react-bootstrap";
import ConfirmModal from "../../Common/ConfirmModal";
import { MODAL_ACTION_CONFIRM } from "../../utilities/constants";
import {
  saveContentAfterPressEnter,
  selectInlineText,
} from "../../utilities/contentEditable";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";

const Column = (props) => {
  const { columns, onUpdateColumn, onCardDrop } = props;
  const cards = columns.cards;

  

  const handleCardDrop = (e, targetCardId) => {
  e.preventDefault();
  e.stopPropagation();

  const draggedCardId = e.dataTransfer.getData("text/plain");
  const finalTargetCardId = targetCardId;

  // If the dragged card is dropped on the same column's title, do nothing
  const targetElement = e.target;
  const isColumnTitle = targetElement.classList.contains("content-editable");
  if (isColumnTitle) {
    return;
  }

  // Perform the card drop action only if onCardDrop is provided as a prop
  if (onCardDrop && typeof onCardDrop === "function") {
    onCardDrop(draggedCardId, finalTargetCardId);
  }

  if (!columns || !columns.cards) {
    return;
  }

  // If the dragged card is dropped on the same column and has a different position, reposition the card
  if (draggedCardId === targetCardId) {
    const newColumns = cloneDeep(columns);
    const draggedCardIndex = newColumns.cards.findIndex(
      (card) => card.id === draggedCardId
    );
    const targetCardIndex = newColumns.cards.findIndex(
      (card) => card.id === targetCardId
    );

    if (draggedCardIndex !== -1) {
      const draggedCard = newColumns.cards.splice(draggedCardIndex, 1)[0];
      newColumns.cards.splice(targetCardIndex, 0, draggedCard);
      onUpdateColumn(newColumns);
    }
  } else {
    // Check if the target column is empty
    if (columns.cards.length === 0) {
      alert("Let's add work to be able to drag and drop");
    }
  }
};


  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...columns,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    toggleShowConfirmModal();
  };


  const [columnTitle, setColumnTitle] = useState("");
  useEffect(() => {
    setColumnTitle(columns.title);
  }, [columns.title]);

  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);
  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...columns,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);
  const newCardTextareaRef = useRef(null);
  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCardForm]);

  const [newCardTitle, setNewCardTitle] = useState("");
  const handleNewCardTitleChange = (e) => setNewCardTitle(e.target.value);
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error("Enter a title for this card!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
      return;
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: columns.boardId,
      columnId: columns.id,
      title: newCardTitle.trim(),
      cover: null,
    };
    const newColumns = cloneDeep(columns);
    newColumns.cards.push(newCardToAdd);
    newColumns.cardOrder.push(newCardToAdd.id);
    onUpdateColumn(newColumns);
    setNewCardTitle("");
    toggleOpenNewCardForm();

    // Show toast message only when a new card is successfully added
    toast.success("Add a successful job listing!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };


  const onDeleteCard = (cardId) => {
    const newColumns = cloneDeep(columns);
    const cardIndex = newColumns.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      newColumns.cards.splice(cardIndex, 1);
      onUpdateColumn(newColumns);
    }
  };

  const onUpdateCard = (newCardUpdate) => {
    props.onUpdateCard(newCardUpdate);
  };

  useEffect(() => {
    // Check if the column is empty (no cards) and the form is not already open
    if (cards.length === 0 && !openNewCardForm) {
      toggleOpenNewCardForm(); // Open the new card form
    }
  }, [cards.length, openNewCardForm]);


  return (
    <>
      <div
        className="column"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => handleCardDrop(e, columns.id)}
      >
        <header className="header">
          <div className="column-title">
            <Form.Control
              size="sm"
              style={{ fontSize: 17, textTransform: "capitalize" }}
              type="text"
              className="content-editable"
              value={columnTitle}
              onChange={handleColumnTitleChange}
              onBlur={handleColumnTitleBlur}
              spellCheck="false"
              onClick={selectInlineText}
              // onMouseDown={(e) => e.preventDefault()}
              onKeyDown={saveContentAfterPressEnter}
            />
          </div>
          <div className="column-dropdown">
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                size="sm"
                className="dropdown-btn"
              ></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={toggleOpenNewCardForm}>
                  Add card
                </Dropdown.Item>
                <Dropdown.Item onClick={toggleShowConfirmModal}>
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>
        <ul className="card-list">
          {cards.map((card, index) => (
            <li
              key={card.id}
              className="card"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", card.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => handleCardDrop(e, card.id)}
            >
              <Card
                card={card}
                onDeleteCard={onDeleteCard}
                onUpdateCard={onUpdateCard}
                onAddNewCard={addNewCard}
              />
            </li>
          ))}
          {cards.length === 0 && (
            <li
              className="empty-card"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", cards.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => handleCardDrop(e, columns.id)}
            >
              Job list is empt
            </li>
          )}
        </ul>
        <footer>
          {openNewCardForm && (
            <div className="add-new-card">
              <div className="form-add">
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder="Enter a title for this card..."
                  className="form-input"
                  ref={newCardTextareaRef}
                  value={newCardTitle}
                  onChange={handleNewCardTitleChange}
                  onKeyDown={(event) => {
                    event.key === "Enter" && addNewCard();
                  }}
                />

                <div className="add-delete">
                  <Button
                    variant="primary"
                    className="btn-sent"
                    onClick={addNewCard}
                  >
                    Add card
                  </Button>
                  <span className="delete" onClick={toggleOpenNewCardForm}>
                    <i className="bx bxs-trash"></i>
                  </span>
                </div>
              </div>
            </div>
          )}
          {!openNewCardForm && (
            <div onClick={toggleOpenNewCardForm} className="add-to-card">
              <i className="bx bx-plus"></i>Add another card
            </div>
          )}
        </footer>
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${columns.title}</strong>?`}
      />
    </>
  );
};

export default Column;
