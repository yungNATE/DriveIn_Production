<template>
  <section class="presentation" id="presentation">
    <div class="container content">
      <MembreEquipe
        src="images/profil_pics/sashaProfilPic.png"
        alt="DriveIn Production"
        :customClass="undefined"
      >
        <h2>Par Sacha Stadtfeld</h2>
        <p>
          Je suis persuadé que la vidéo est le support de communication par
          excellence ! Dans un monde dominé par le web j'ai donc décidé de me
          former aux métiers du digital et de l'audiovisuel pour devenir
          réalisateur vidéo.
        </p>
      </MembreEquipe>
      <MembreEquipe
        src="images/profil_pics/arthurProfilPic.png"
        alt="DriveIn Production"
        customClass="blue"
      >
        <h2>Avec Arthur Roberdeau</h2>
        <p>
          Arthur passionné par la photographie et la vidéo depuis tout petit.
          Devenu photographe professionnel depuis de nombreuses années, je me
          suis spécialisé dans les photographies événementielles, afin de vous
          offrir un service unique et personnalisé.
        </p>
      </MembreEquipe>
    </div>
  </section>
</template>

<style scoped lang="scss">
section.presentation {
  position: relative;
  margin-block: 200px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 100%;
    opacity: 0.5;
    z-index: -1;
  }
  &:before {
    left: 0;
    background: radial-gradient(
      ellipse at 0% 50%,
      rgba($primary-color-light, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  &:after {
    right: 0;
    background: radial-gradient(
      ellipse at 100% 50%,
      rgba($secondary-color-dark, 50%) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  }
  div.content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
  }
}
</style>
