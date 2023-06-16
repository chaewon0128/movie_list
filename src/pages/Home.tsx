import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import styled from "styled-components";
import Loader from "../component/Loader";
import { getPopular, IMovie, makeImagePath } from "../api";
import { useMatch, useNavigate } from "react-router-dom";
import Modal from "../component/Modal";

const Popular = styled(motion.div)`
  margin: 0 auto;
  width: 900px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 70px;
  padding-bottom: 100px;
`;

const Wrapper = styled(motion.div)`
  position: relative;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 400px;
  border-radius: 10px;
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
`;
const MovieTitle = styled.h3`
  font-size: 28px;
  text-align: center;
  margin-top: 20px;
  font-family: "Francois One", sans-serif;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
`;

const movieVariant = {
  start: { opacity: 0, y: 10, scale: 0.5 },
  exit: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
      duration: 0.5,
      delayChildren: 0.2,
      staggerChildren: 0.2
    }
  }
};

const boxVariant = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.2, y: -30, transition: { delay: 0.2 } }
};

export default function Home() {
  const { data, isLoading } = useQuery(["movies", "popular"], getPopular);
  const movieMatch = useMatch("movies/:id");
  const navigate = useNavigate();
  const onBoxClick = (id: number, title?: string) => {
    navigate(`movies/${id}`, {
      state: {
        movieTitle: title,
        movieId: id
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Popular>
          {data?.results.map((movie: IMovie) => (
            <Wrapper variants={movieVariant} initial="start" animate="end">
              <Box
                onClick={() => onBoxClick(movie.id, movie.title)}
                variants={boxVariant}
                whileHover="hover"
                transition={{ delay: 0.2 }}
                bgPhoto={makeImagePath(movie.poster_path)}
              />
              <MovieTitle>{movie.original_title}</MovieTitle>
            </Wrapper>
          ))}
        </Popular>
      )}
      {movieMatch && (
        <>
          <Overlay />
          <Modal />
        </>
      )}
    </>
  );
}