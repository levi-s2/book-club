import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { BookClubsContext } from './context/BookClubsContext';
import NavBar from './NavBar';
import { Card, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ThemeContext } from './context/ThemeContext';
import './css/BookClubDetails.css';
import Posts from './Posts';

const BookClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { fetchClubDetails, joinClub, leaveClub } = useContext(BookClubsContext);
  const [clubDetails, setClubDetails] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getClubDetails = async () => {
      const details = await fetchClubDetails(id);
      if (details) {
        setClubDetails(details);
        setPosts(details.posts || []);
      }
    };

    getClubDetails();
  }, [id, fetchClubDetails]);

  const handleJoinClub = async () => {
    const updatedDetails = await joinClub(id);
    if (updatedDetails) {
      setClubDetails(updatedDetails);
    }
  };

  const handleLeaveClub = async () => {
    const updatedDetails = await leaveClub(id);
    if (updatedDetails) {
      setClubDetails(updatedDetails);
    }
  };

  if (!clubDetails) {
    return <div>Loading...</div>;
  }

  const isCreator = user && clubDetails.creator && user.id === clubDetails.creator.id;
  const isMember = user && clubDetails.members.some(member => member.id === user.id);

  return (
    <div>
      <NavBar />
      <div className={`book-club-details ${theme}`}>
        <div className="left-column">
          <div className="club-header">
            <h2>{clubDetails.name}</h2>
            <p>{clubDetails.description}</p>
          </div>
          <div className="club-genres">
            <h3>Genres</h3>
            {clubDetails.genres && clubDetails.genres.length > 0 ? (
              <ul>
                {clubDetails.genres.map((genre) => (
                  <li key={genre.id}>{genre.name}</li>
                ))}
              </ul>
            ) : (
              <p>No genres selected.</p>
            )}
          </div>
          {!isMember && !isCreator ? (
            <Button type="primary" onClick={handleJoinClub} className="join-club-button">Join Club</Button>
          ) : (
            !isCreator && <Button type="danger" onClick={handleLeaveClub} className="leave-club-button">Leave Club</Button>
          )}
          <div className="club-current-reading">
            <h3>Current Reading</h3>
            {clubDetails.current_book ? (
              <Card
                hoverable
                cover={<img alt={clubDetails.current_book.title} src={clubDetails.current_book.image_url} />}
              >
                <Card.Meta title={clubDetails.current_book.title} description={`Started at: ${new Date(clubDetails.current_book.started_at).toLocaleDateString()}`} />
              </Card>
            ) : (
              <p>No current book.</p>
            )}
          </div>
        </div>
        <div className="center-column">
          {isMember || isCreator ? (
            <Posts clubId={id} posts={posts} setPosts={setPosts} />
          ) : (
            <p>You must be a member to view and post comments.</p>
          )}
        </div>
        <div className="right-column">
          <div className="club-creator">
            <h3>Creator</h3>
            {clubDetails.creator ? (
              <div>
                <Link to={`/users/${clubDetails.creator.id}`} className="profile-link">
                  {clubDetails.creator.username}
                </Link>
              </div>
            ) : (
              <p>Unknown creator</p>
            )}
          </div>
          <div className="club-members">
            <h3>Members</h3>
            {clubDetails.members && clubDetails.members.length > 0 ? (
              <ul>
                {clubDetails.members.map((member) => (
                  <li key={member.id}>
                    <UserOutlined />
                    <Link to={`/users/${member.id}`} className="profile-link">
                      {member.username}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClubDetails;
