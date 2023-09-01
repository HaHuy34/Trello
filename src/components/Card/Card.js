import { Form } from "react-bootstrap";
import { saveContentAfterPressEnter } from "../../utilities/contentEditable";
import { useEffect, useState, useRef } from "react";

const Card = (props) => {
  const { card, onDeleteCard, onUpdateCard } = props;
  const [cardTitle, setCardTitle] = useState("");

  const cardTitleRef = useRef(null);

  useEffect(() => {
    setCardTitle(card.title);
  }, [card.title]);

  const deleteCard = () => {
    onDeleteCard(card.id);
  };

  const handleCardTitleBlur = () => {
    const newCard = {
      ...card,
      title: cardTitleRef.current.value,
    };
    onUpdateCard(newCard);
  };

  const selectInlineText = (e) => {
    e.target.focus();
    e.target.select();
    handleCardTitleBlur();
  };

  return (
    <>
      <div
        className="work-name"
        //  draggable="true"
      >
        <Form.Control
          size="sm"
          className="content-column"
          defaultValue={cardTitle}
          ref={cardTitleRef}
          onBlur={handleCardTitleBlur}
          spellCheck={false}
          onKeyDown={saveContentAfterPressEnter}
          onClick={selectInlineText}
          // onMouseDown={(e) => e.preventDefault()}
          // draggable="true"
        />
        <div className="edit">
          <i className="bx bx-trash" onClick={deleteCard}></i>
        </div>
      </div>
    </>
  );
};

export default Card;
