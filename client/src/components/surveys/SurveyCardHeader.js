import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
// Components
import ProfilePopover from "../profile/ProfilePopover";
// Context
import { UserContext } from "../../context/UserContext";
// Images
import EditIcon from "../img/edit-icon.svg";
// Functions
import {
  formatExpirationDate,
  formatCreatedAtDate,
} from "../functions/dateFormatting";

export default function SurveyCardHeader({ survey }) {
  // Context
  const [userState] = useContext(UserContext);
  // State
  const [author, setAuthor] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  // Set survey author
  useEffect(() => {
    axios
      .get(`/api/users/${survey.author}`)
      .then((res) => {
        // Set survey author
        setAuthor(res.data);
      })
      .catch(() => {
        // If there is any error set survye author to empty string
        setAuthor("");
      });
    // Set formatted created at date
    setCreatedAt(formatCreatedAtDate(survey.createdAt));
    // Set formatted expiration date if there is any
    if (survey.expirationDate) {
      setExpirationDate(formatExpirationDate(survey.expirationDate));
    }
  }, []);

  return (
    <>
      {expirationDate && (
        <Alert variant="info" className="mt-3 mb-4">
          This survey has expiration date set to:
          <b> {expirationDate}</b>. After this time survey will be closed.
        </Alert>
      )}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <Card.Title>{survey.title}</Card.Title>
          {survey.description && (
            <p className="mb-3 mt-2">{survey.description}</p>
          )}
          <Card.Subtitle className="text-muted">
            {author && (
              <>
                {createdAt} - by <ProfilePopover user={author} />
              </>
            )}
          </Card.Subtitle>
        </div>
        {userState.isAuth && survey.author === userState.user._id && (
          <Button variant="secondary">
            <Image src={EditIcon} height="14" className="mr-2" />
            Edit
          </Button>
        )}
      </div>
    </>
  );
}
