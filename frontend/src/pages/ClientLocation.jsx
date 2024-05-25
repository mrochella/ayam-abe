import React from "react";
import NavbarClient from "../components/NavbarClient";

const ClientLocation = () => {
  return (
    <div>
      <NavbarClient />
      <div className="containerr" style={{ height: "100vh" }}>
        <div
          className="is-flex is-justify-content-center py-6"
          style={{ backgroundColor: "orange" }}
        >
          <p
            className="is-size-1 is-white has-text-weight-bold"
            style={{ color: "#D91319" }}
          >
            Lokasi Kami
          </p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126630.83000676867!2d112.63439051018031!3d-7.329909122105359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7faf2c4ea186d%3A0x2360ca74741caa65!2sAYAM%20GORENG%20ABE!5e0!3m2!1sid!2sid!4v1701404018539!5m2!1sid!2sid"
          width="1000"
          height="400"
          style={{
            border: 0,
            margin: "auto",
            allowfullscreen: "",
            loading: "lazy",
            referrerpolicy: "no-referrer-when-downgrade",
            display: "block",
            marginTop: "30px",
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default ClientLocation;
