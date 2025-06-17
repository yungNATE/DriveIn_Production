<template>
  <ul>
    <li>
      <IconLink
        to="https://facebook.com"
        icon="facebookIcon"
        alt="Lien vers la page Facebook"
      />
    </li>
    <li>
      <IconLink
        to="https://twitter.com"
        icon="twitterIcon"
        alt="Lien vers la page Twitter"
      />
    </li>
    <li>
      <IconLink
        to="https://instagram.com"
        icon="instagramIcon"
        alt="Lien vers la page Instagram"
      />
    </li>
    <li>
      <IconLink
        to="https://youtube.com"
        icon="youtubeIcon"
        alt="Lien vers la page Youtube"
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

.icon-link {
  &:hover {
    .icon :deep(svg) {
      opacity: 1;
      filter: drop-shadow(0 0 8px $primary-color-light);
    }
  }

  :deep.icon :deep(svg) {
    fill: currentColor;
    transition:
      opacity 0.2s ease,
      filter 0.2s ease;
    opacity: 0.75;
  }
}
</style>
