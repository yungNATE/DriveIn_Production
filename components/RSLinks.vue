<template>
  <ul>
    <li>
      <IconLink
        to="https://facebook.com"
        icon="facebookIcon"
        alt="Notre page Facebook"
        classes="glowing"
      />
    </li>
    <li>
      <IconLink
        to="https://twitter.com"
        icon="twitterIcon"
        alt="Notre compte Twitter"
        classes="glowing"
      />
    </li>
    <li>
      <IconLink
        to="https://instagram.com"
        icon="instagramIcon"
        alt="Notre compte Instagram"
        classes="glowing"
      />
    </li>
    <li>
      <IconLink
        to="https://youtube.com"
        icon="youtubeIcon"
        alt="Notre chaîne Youtube"
        classes="glowing"
      />
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
</style>
