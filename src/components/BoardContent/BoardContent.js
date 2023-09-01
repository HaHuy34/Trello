import React, { useEffect, useRef, useState } from "react";
import Column from "../Column/Column";
import { initiallData } from "../../actions/initialData";
import { mapOrder } from "../../utilities/sort";
import { Button, Form } from "react-bootstrap";
import { isEmpty } from "lodash";
import { ToastContainer, toast } from "react-toastify";

const BoardContent = ({ searchValue }) => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const newColumnInput = useRef(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  const onNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value);
  };

  useEffect(() => {
    const boardFromDB = initiallData.boards.find(
      (board) => board.id === "boards-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    if (newColumnInput && newColumnInput.current) {
      newColumnInput.current.focus();
      newColumnInput.current.select();
    }
  }, [openNewColumnForm]);

  if (isEmpty(board)) {
    return <div className="notFound">Board not found!</div>;
  }

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInput.current.focus();
      newColumnInput.current.select();
      return;
    }
    toast.success("Add a successful job column!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    const newColumns = [...columns, newColumnToAdd];
    const newColumnOrder = newColumns.map((column) => column.id);
    const newBoard = {
      ...board,
      columnOrder: newColumnOrder,
      columns: newColumns,
    };

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle("");
    toggleOpenNewColumnForm();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;
    const columnIndexToUpdate = columns.findIndex(
      (column) => column.id === columnIdToUpdate
    );

    if (columnIndexToUpdate === -1) {
      return;
    }

    const newColumns = [...columns];
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    const newColumnOrder = newColumns.map((column) => column.id);
    const newBoard = {
      ...board,
      columnOrder: newColumnOrder,
      columns: newColumns,
    };

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const filteredColumns = columns.filter((column) =>
    column.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (filteredColumns.length === 0) {
    return <h3 className="show-list-column">There are no job listings</h3>;
  }

  const onUpdateCard = (newCardUpdate) => {
    const cardIdUpdate = newCardUpdate.id;
    const newColumns = columns.map((column) => {
      if (column.cards.some((card) => card.id === cardIdUpdate)) {
        const newCards = column.cards.map((card) => {
          if (card.id === cardIdUpdate) {
            return newCardUpdate;
          }
          return card;
        });
        return { ...column, cards: newCards };
      }
      return column;
    });
    setColumns(newColumns);
  };

  const handleDragStart = (e, column) => {
    setDraggedColumn(column);
  };
  const handleDragEnter = (e, column) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định khi kéo và thả

    setTargetColumn(column); // Cập nhật targetColumn
  };

  const handleDragEnd = () => {
    if (draggedColumn && targetColumn) {
      const newColumns = [...columns];
      const draggedColumnIndex = newColumns.findIndex(
        (col) => col.id === draggedColumn.id
      );
      const targetColumnIndex = newColumns.findIndex(
        (col) => col.id === targetColumn.id
      );

      // Swap the draggedColumn and targetColumn in the newColumns array
      [newColumns[draggedColumnIndex], newColumns[targetColumnIndex]] = [
        newColumns[targetColumnIndex],
        newColumns[draggedColumnIndex],
      ];

      setColumns(newColumns);
    }

    setDraggedColumn(null);
    setTargetColumn(null);
  };

  const handleCardDrop = (draggedCardId, targetCardId) => {
    if (draggedCardId && targetCardId && draggedCardId !== targetCardId) {
      // Perform the card drop logic when both IDs are present and not equal
      const newColumns = [...columns];
      const draggedColumn = newColumns.find((column) =>
        column.cards.find((card) => card.id === draggedCardId)
      );

      if (!draggedColumn || draggedColumn.cards.length === 0) {
        return;
      }

      const draggedCard = draggedColumn.cards.find(
        (card) => card.id === draggedCardId
      );

      const targetColumn = newColumns.find((column) =>
        column.cards.find((card) => card.id === targetCardId)
      );

      if (draggedCard && draggedColumn && targetColumn) {
        const draggedCardIndex = draggedColumn.cards.findIndex(
          (card) => card.id === draggedCardId
        );
        draggedColumn.cards.splice(draggedCardIndex, 1);
        draggedColumn.cardOrder = draggedColumn.cardOrder.filter(
          (id) => id !== draggedCardId
        );

        const targetCardIndex = targetColumn.cardOrder.findIndex(
          (id) => id === targetCardId
        );
        console.log(draggedCardIndex);

        if (targetCardIndex !== -1) {
          targetColumn.cards.splice(targetCardIndex + 1, 0, draggedCard);
          targetColumn.cardOrder.splice(targetCardIndex + 1, 0, draggedCardId);
        } else {
          targetColumn.cards.push(draggedCard);
          targetColumn.cardOrder.push(draggedCardId);
        }

        const newColumnOrder = newColumns.map((column) => column.id);
        const newBoard = {
          ...board,
          columnOrder: newColumnOrder,
          columns: newColumns,
        };

        setColumns(newColumns);
        setBoard(newBoard);
      }
    } else if (draggedCardId && !targetCardId) {
      // Handle dropping the card into an empty column
      const newColumns = [...columns];
      const draggedColumn = newColumns.find((column) =>
        column.cards.find((card) => card.id === draggedCardId)
      );

      if (!draggedColumn || draggedColumn.cards.length === 0) {
        return;
      }

      const draggedCard = draggedColumn.cards.find(
        (card) => card.id === draggedCardId
      );

      const emptyColumn = newColumns.find(
        (column) => column.cards.length === 0
      );

      if (draggedCard && draggedColumn && emptyColumn) {
        const draggedCardIndex = draggedColumn.cards.findIndex(
          (card) => card.id === draggedCardId
        );
        draggedColumn.cards.splice(draggedCardIndex, 1);
        draggedColumn.cardOrder = draggedColumn.cardOrder.filter(
          (id) => id !== draggedCardId
        );

        emptyColumn.cards.push(draggedCard);
        emptyColumn.cardOrder.push(draggedCardId);

        const newColumnOrder = newColumns.map((column) => column.id);
        const newBoard = {
          ...board,
          columnOrder: newColumnOrder,
          columns: newColumns,
        };

        setColumns(newColumns);
        setBoard(newBoard);
      }
    }
  };

  return (
    <>
      <div className="board-columns">
        {filteredColumns.map((column, index) => (
          <div
            id="column-main"
            key={column.id}
            className="column"
            draggable
            onDragStart={(e) => handleDragStart(e, column)}
            onDragEnter={(e) => handleDragEnter(e, column)}
            onDragEnd={handleDragEnd}
          >
            <Column
              columns={column}
              onUpdateColumn={onUpdateColumn}
              onCardDrop={handleCardDrop}
              onUpdateCard={onUpdateCard}
            />
          </div>
        ))}
        <div className="form-list-add">
          {!openNewColumnForm && (
            <div className="add-list" onClick={toggleOpenNewColumnForm}>
              <i className="bx bx-plus"></i>
              <span>More lists</span>
            </div>
          )}
          {openNewColumnForm && (
            <div className="form-add" id="add-list">
              <Form.Control
                size="sm"
                placeholder="Enter a list title..."
                className="form-input"
                ref={newColumnInput}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) => {
                  event.key === "Enter" && addNewColumn();
                }}
              />
              <div className="add-dele">
                <Button className="btn-sent ac" onClick={addNewColumn}>
                  Add list
                </Button>
                <span className="dele" onClick={toggleOpenNewColumnForm}>
                  <i className="bx bxs-trash"></i>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
};

export default BoardContent;


