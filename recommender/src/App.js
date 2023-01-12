import * as React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios, { isCancel, AxiosError } from "axios";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import Info from "@mui/icons-material/Info";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const filterData = async (query) => {
  try {
    let data = await axios.post("http://localhost:5000/find_title", {
      text: query,
    });
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

const toggleMovie = (movie, selectedMovies, setSelectedMovies) => {
  selectedMovies = new Set(selectedMovies);

  if (selectedMovies.has(movie)) {
    selectedMovies.delete(movie);
  } else {
    selectedMovies.add(movie);
  }
  setSelectedMovies(selectedMovies);
};

const generateRecommendations = (selectedMovies, setRecommendations) => {
  axios
    .post("http://localhost:5000/generate_recommendation", {
      movies: Array.from(selectedMovies),
    })
    .then((data) => {
      console.log(data.data);
      setRecommendations(data.data);
    });
};

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Select recently watched movies"
      variant="outlined"
      placeholder="Search..."
      size="small"
      fullWidth
    />
  </form>
);

export default function App() {
  const [titles, setTitles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovies, setSelectedMovies] = useState(new Set());
  const [showSelected, setshowSelected] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    filterData(searchQuery)
      .then((res) => {
        setTitles(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [searchQuery]);
  useEffect(() => {
    filterData(searchQuery)
      .then((res) => {
        setTitles(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [searchQuery]);
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3">Movie Recommender</Typography>

        <Box sx={{ mt: 4 }}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Box>
        <Grid container style={{ padding: 3 }} alignItems="center">
          {titles.map((movie) => (
            <Grid
              key={movie + selectedMovies.has(movie).toString()}
              item
              xs={12}
            >
              <Button
                onClick={() =>
                  toggleMovie(movie, selectedMovies, setSelectedMovies)
                }
                startIcon={selectedMovies.has(movie) && <CheckIcon />}
                fullWidth
              >
                {movie}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="h4" display={"inline"}>
              Selected Movies ({selectedMovies.size})
            </Typography>
            <Button onClick={() => setshowSelected(!showSelected)} color="info">
              {showSelected ? "hide" : "show"}
            </Button>
          </Grid>

          {showSelected &&
            Array.from(selectedMovies).map((movie) => (
              <Grid
                key={movie + selectedMovies.has(movie).toString()}
                item
                xs={4}
                style={{ padding: 5 }}
              >
                <Button
                  onClick={() =>
                    toggleMovie(movie, selectedMovies, setSelectedMovies)
                  }
                  fullWidth
                >
                  {movie}
                </Button>
              </Grid>
            ))}
          <Button
            onClick={() =>
              generateRecommendations(selectedMovies, setRecommendations)
            }
            color="success"
            fullWidth
          >
            Generate Recommendations
          </Button>
          <Grid item xs={12}>
            <Typography variant="h4" display={"inline"}>
              Recommendations
            </Typography>
          </Grid>
          {Array.from(recommendations).map((movie) => (
            <Grid
              key={movie + selectedMovies.has(movie).toString()}
              item
              xs={4}
              style={{ padding: 5 }}
            >
              <Button fullWidth>{movie}</Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
