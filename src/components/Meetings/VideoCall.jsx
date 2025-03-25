import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import socket from "./socket";
import { Container, Grid, Paper, Button, Typography } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CallEndIcon from "@mui/icons-material/CallEnd";

// ✅ Fix for Simple-Peer (Ensuring process.nextTick is available)
window.global = window;
window.process = {
  ...window.process,
  env: {},
  nextTick: (callback) => Promise.resolve().then(callback),
};

// ✅ Ensuring Buffer is available
import { Buffer } from "buffer";
window.Buffer = Buffer;

const VideoCall = () => {
  const { meetingId } = useParams();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socket.emit("join-meeting", { meetingId, peerId: socket.id });

        socket.on("all-users", (users) => {
          const peersArray = users
            .filter(
              (userId) => !peersRef.current.some((p) => p.peerId === userId)
            ) // Prevent duplicates
            .map((userId) => {
              const peer = createPeer(userId, socket.id, stream);
              peersRef.current.push({ peerId: userId, peer });
              return { peer, id: userId };
            });

          setPeers((prevPeers) => [...prevPeers, ...peersArray]);
        });

        socket.on("user-joined", ({ signal, callerId }) => {
          if (!peersRef.current.some((p) => p.peerId === callerId)) {
            const peer = addPeer(signal, callerId, stream);
            peersRef.current.push({ peerId: callerId, peer });
            setPeers((prevPeers) => [...prevPeers, { peer, id: callerId }]);
          }
        });

        socket.on("receiving-returned-signal", ({ id, signal }) => {
          const peerObj = peersRef.current.find((p) => p.peerId === id);
          if (peerObj) peerObj.peer.signal(signal);
        });

        socket.on("user-disconnected", (peerId) => {
          const peerObj = peersRef.current.find((p) => p.peerId === peerId);
          if (peerObj) peerObj.peer.destroy();
          peersRef.current = peersRef.current.filter(
            (p) => p.peerId !== peerId
          );
          setPeers((prevPeers) => prevPeers.filter((p) => p.id !== peerId));
        });
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    return () => {
      socket.emit("leave-meeting", { meetingId, peerId: socket.id });

      // ✅ Remove event listeners
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("receiving-returned-signal");
      socket.off("user-disconnected");

      // ✅ Destroy all peer connections and clear state
      peersRef.current.forEach(({ peer }) => peer.destroy());
      peersRef.current = [];
      setPeers([]);
    };
  }, [meetingId]);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { userToSignal, callerId, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerId });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  const toggleVideo = () => {
    if (stream && stream.getVideoTracks().length > 0) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const leaveCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    socket.emit("leave-meeting", { meetingId, peerId: socket.id });
    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];
    setPeers([]);
  };

  // ✅ Handling Peer Video Streams
  const handlePeerStream = (peer, videoElement) => {
    peer.on("stream", (remoteStream) => {
      console.log("Setting peer stream:", remoteStream);
      if (videoElement) {
        videoElement.srcObject = remoteStream;
      }
    });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Meeting ID: {meetingId || "Loading..."}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {/* User's own video */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <video
              ref={userVideo}
              autoPlay
              playsInline
              muted
              style={{ width: "100%" }}
            />
          </Paper>
        </Grid>

        {/* Peers' videos */}
        {peers.map(({ peer, id }) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Paper elevation={3}>
              <video
                ref={(ref) => ref && handlePeerStream(peer, ref)}
                autoPlay
                playsInline
                style={{ width: "100%" }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Grid
        container
        justifyContent="center"
        spacing={2}
        style={{ marginTop: 20 }}
      >
        <Grid item>
          <Button
            variant="contained"
            color={videoEnabled ? "primary" : "secondary"}
            onClick={toggleVideo}
          >
            <VideocamIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color={audioEnabled ? "primary" : "secondary"}
            onClick={toggleAudio}
          >
            <MicIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="error" onClick={leaveCall}>
            <CallEndIcon />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoCall;
