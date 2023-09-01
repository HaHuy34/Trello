export const initiallData = {
  boards: [
    {
      id: "boards-1",
      columnOrder: ["column-1", "column-2",   "column-3"],
      columns: [
        {
          id: "column-1",
          boardId: "board-1",
          title: "To do",
          cardOrder: ["card-1", "card-2", "card-3"],
          cards: [
            {
              id: "card-1",
              boardId: "board-1",
              columnId: "column-1",
              title: "1",
              cover: "",
            },
            {
              id: "card-2",
              boardId: "board-2",
              columnId: "column-2",
              title: "2",
              cover: null,
            },
            {
              id: "card-3",
              boardId: "board-3",
              columnId: "column-3",
              title: "3",
              cover: null,
            },
          ],
        },
        {
          id: "column-2",
          boardId: "board-1",
          title: "Doing",
          cardOrder: ["card-4", "card-5", "card-6"],
          cards: [
            {
              id: "card-4",
              boardId: "board-1",
              columnId: "column-1",
              title: "4",
              cover: null,
            },
            {
              id: "card-5",
              boardId: "board-2",
              columnId: "column-2",
              title: "5",
              cover: null,
            },
            {
              id: "card-6",
              boardId: "board-3",
              columnId: "column-3",
              title: "6",
              cover: null,
            },
          ],
        },
        {
          id: "column-3",
          boardId: "board-1",
          title: "Done",
          cardOrder: ["card-7", "card-8", "card-9"],
          cards: [
            {
              id: "card-7",
              boardId: "board-1",
              columnId: "column-1",
              title: "7",
              cover: null,
            },
            {
              id: "card-8",
              boardId: "board-2",
              columnId: "column-2",
              title: "8",
              cover: null,
            },
            {
              id: "card-9",
              boardId: "board-3",
              columnId: "column-3",
              title: "9",
              cover: null,
            },
          ],
        },
      ],
    },
  ],
};
