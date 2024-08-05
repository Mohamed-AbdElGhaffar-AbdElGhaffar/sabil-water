import { useEffect } from 'react';

const Requests = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div></div>;
};

export default Requests;
