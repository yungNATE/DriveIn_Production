<template>
  <h1 class="sr-only">À propos - DriveIn Production !</h1>
  <section class="hero">
    <div class="text">
      <p class="h1">L'agence</p>
      <p>
        Driveln Production est une société spécialisée dans la réalisation vidéo
        sur mesure, au service des marques. des institutions et des créateurs de
        demain. De la conception à la postproduction, nous donnons vie à vos
        idées àDe la signature électronique à la remise des livrables
        numériques, tout est pensé pour réduire l'utilisation de papier et
        simplifier les échanges. travers des contenus percutants, engageants et
        parfaitement adaptés à votre public. Notre équipe réunit des
        réalisatcleurs, cadreurs, monteurs et motion designers passionnés,
        capables de répondre à tous types de projets : films institutionnels,
        vidéos corporate, publicités, clips musicaux, contenus pour les réseaux
        sociaux, captations d'événements, et bien plus encore.
      </p>
    </div>
    <div class="photo">
      <ImgGlow
        src="/images/profil_pics/sashaProfilPic.png"
        alt="À propos de DriveIn Production !"
      />
    </div>
  </section>
</template>

<script setup>
import ImgGlow from "~/components/ImgGlow.vue";

definePageMeta({
  title: "À propos",
});
</script>
