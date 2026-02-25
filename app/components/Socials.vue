<template>
  <ul>
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
        to="https://vimeo.com"
        icon="vimeoIcon"
        alt="Notre chaîne Vimeo"
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
