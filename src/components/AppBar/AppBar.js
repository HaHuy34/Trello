const AppBar = ({ setSearchValue }) => {
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchInput = event.target.value.trim();
      if (searchInput !== "") {
        setSearchValue(searchInput);
      }
      event.target.value = "";

      const formListAdd = document.querySelector(".form-list-add");
      if (formListAdd) {
        formListAdd.style.display = "none";
      }
    }
  };

  return (
    <>
      <nav className="navbar app">
        <div className="header-left">
          <div className="menu-left">
            <h3 className="logo-git">
              <img
                src="https://trello.com/assets/87e1af770a49ce8e84e3.gif"
                alt=""
              />
            </h3>
            <i className="bx bx-star"></i>
            <div className="pp">
              <i className="bx bxs-user-check"></i>
              <p>Show in Workspace</p>
            </div>
          </div>
          <div className="menu-header">
            <div className="search">
              <input
                type="text"
                id="input-search"
                placeholder="Search"
                onKeyDown={handleSearchKeyDown}
              />
              <i className="bx bx-search-alt-2"></i>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppBar;
// import React, { useState } from "react";

// const AppBar = ({ onSearchQueryChange }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearch = (e) => {
//     const searchQuery = e.target.value;
//     setSearchQuery(searchQuery);
//     onSearchQueryChange(searchQuery);
//   };

//   return (
//     <>
//       <nav className="navbar app">
//         <div className="header-left">
//           <h3>Trello</h3>
//           <i className="bx bx-star"></i>
//           <div className="menu-header">
//             <div className="pp">
//               <i className="bx bxs-user-check"></i>
//               <p>Show in Workspace</p>
//             </div>
//             <div className="search">
//               <input
//                 value={searchQuery}
//                 type="text"
//                 id="input-search"
//                 placeholder="Search"
//                 onChange={handleSearch}
//               />
//               <i className="bx bx-search-alt-2"></i>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default AppBar;
