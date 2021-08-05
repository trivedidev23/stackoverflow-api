import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = () => {
  const [term, setTerm] = useState("reactjs");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get(
        "https://api.stackexchange.com/2.3/questions/",
        {
          params: {
            order: "desc",
            sort: "activity",
            site: "stackoverflow",
            tagged: term,
          },
          headers: {
            client_id: process.env.REACT_APP_API_USER,
            client_secret: process.env.REACT_APP_API_SECRET,
            key: process.env.REACT_APP_API_KEY,
          },
        }
      );
      setResults(data.items);
      console.log(data.items);
    };
    if (term && !results.length) {
      search();
    } else {
      const timeOutId = setTimeout(() => {
        if (term) {
          search();
        }
      }, 1000);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [term]);

  const renderedList = results.map((result) => {
    return (
      <div key={result.question_id} className="item">
        <div className="right floated content">
          <a
            className="ui button"
            href={`https://stackoverflow.com/questions/${result.question_id}/`}
          >
            Get Answer
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
        </div>
        <div className="">{`Author : ${result.owner.display_name} `}</div>
      </div>
    );
  });

  return (
    <div className="ui container">
      <div className="search-bar ui segment">
        <div className="ui form">
          <div className="field">
            <label>Search your query</label>
            <input
              type="text"
              className="input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ui celled list">{renderedList}</div>
    </div>
  );
};

export default SearchBar;
