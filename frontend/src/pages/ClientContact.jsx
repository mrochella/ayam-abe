import React from 'react'
import { IoLogoFacebook, IoLogoInstagram, IoLogoTiktok } from "react-icons/io5";
import NavbarClient from '../components/NavbarClient'

const ClientContact = () => {
  return (
    <div>
      <NavbarClient/>
	  <div className='containerr' style={{ height: "100vh"}} >
	  <div className='is-flex is-justify-content-center py-6' style={{ backgroundColor: "orange" }}>
        <p className='is-size-1 is-white has-text-weight-bold' style={{ color: "#D91319" }}>Kontak Kami</p>
        </div>
		<section class="heroo is-fullheight">
		<div class="hero-body">
			<div class="container has-text-centered">
				<div class="columns is-8 is-variable ">
					<div class="column is-two-thirds has-text-left">
						<h1 class="title is-1">Kontak Kami</h1>
						<p class="is-size-4">Beri masukan kepada kami agar kami bisa meningkatkan Pelayanan terhadap anda.</p>
						<div class="social-media mt-4">
							<a href="https://facebook.com" target="_blank" class="button is-light is-large"><IoLogoFacebook/></a>
							<a href="https://instagram.com" target="_blank" class="button is-light is-large"><IoLogoInstagram/></a>
							<a href="https://twitter.com" target="_blank" class="button is-light is-large"><IoLogoTiktok/></a>
						</div>
					</div>
					<div class="column is-one-third has-text-left">
						<div class="field">
							<label class="label">Name</label>
							<div class="control">
								<input class="input is-medium" type="text"/>
							</div>
						</div>
						<div class="field">
							<label class="label">Email</label>
							<div class="control">
								<input class="input is-medium" type="text"/>
							</div>
						</div>
						<div class="field">
							<label class="label">Message</label>
							<div class="control">
								<textarea class="textarea is-medium"></textarea>
							</div>
						</div>
						<div class="control">
							<button type="submit" class="button is-link is-fullwidth has-text-weight-medium is-medium">Send Message</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	  </div>
      
    </div>
  )
}

export default ClientContact
