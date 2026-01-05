<script setup lang="ts">
definePageMeta({
  title: "Politique de confidentialité",
});

const siteUrl = "https://drive-inproduction.com";
</script>

<template>
  <section class="politique">
    <div class="container">
      <h1>Politique de confidentialité</h1>
      <p class="intro">
        Cette page explique comment DRIVE-IN PRODUCTION traite vos données
        personnelles lorsque vous utilisez {{ siteUrl }}.
      </p>

      <div class="content">
        <h2 class="h3">1. Responsable du traitement</h2>
        <p>
          <strong>Responsable du traitement</strong> : SASU DRIVE-IN PRODUCTION
          (voir la page Mentions légales).
        </p>
        <p>
          <strong>Contact</strong> : contact@drive-inproduction.com —
          <strong>Adresse</strong> : 24 RUE DE VERDUN 94220 CHARENTON-LE-PONT.
        </p>
        <p>
          <strong>DPO</strong> : Sacha STADTFELD —
          contact@drive-inproduction.com
        </p>

        <h2 class="h3">2. Données collectées</h2>
        <p>
          Le site ne met pas en place de création de compte. La collecte de
          données personnelles intervient principalement lorsque vous utilisez
          le formulaire de contact.
        </p>
        <ul class="list">
          <li>
            <strong>Formulaire de contact</strong> : nom, prénom, objet de la
            demande, email, téléphone, message.
          </li>
          <li>
            <strong>Anti-spam</strong> : un champ technique ("honeypot") destiné
            à détecter les soumissions automatiques.
          </li>
          <li>
            <strong>Données techniques</strong> : aucune collecte volontaire
            côté site. Des données techniques peuvent toutefois être traitées
            par l’hébergeur (ex : logs) pour le fonctionnement et la sécurité.
          </li>
        </ul>

        <h2 class="h3">3. Finalités</h2>
        <ul class="list">
          <li>
            Répondre à vos demandes (prise d’informations, devis, projet,
            production, post-production, etc.).
          </li>
          <li>Assurer le suivi des échanges commerciaux et précontractuels.</li>
          <li>Lutter contre le spam et les abus sur le formulaire.</li>
        </ul>

        <h2 class="h3">4. Base légale</h2>
        <ul class="list">
          <li>
            <strong>Mesures précontractuelles</strong> (article 6.1(b) RGPD)
            lorsque vous contactez DRIVE-IN PRODUCTION pour préparer une
            prestation (ex : devis).
          </li>
          <li>
            <strong>Intérêt légitime</strong> (article 6.1(f) RGPD) pour
            répondre aux demandes entrantes et sécuriser le formulaire
            (anti-spam).
          </li>
        </ul>

        <h2 class="h3">5. Destinataires et sous-traitants</h2>
        <p>
          Les données sont destinées aux personnes habilitées au sein de
          DRIVE-IN PRODUCTION.
        </p>
        <ul class="list">
          <li>
            <strong>Hébergement & formulaires</strong> : Netlify, Inc.
            (hébergeur). Le formulaire de contact est traité via Netlify Forms.
          </li>
          <li>
            <strong>Emails / outils de messagerie</strong> : Netlify, Inc.
          </li>
        </ul>

        <h2 class="h3">6. Durées de conservation</h2>
        <p>
          Les données issues du formulaire de contact sont conservées pendant
          une durée limitée et proportionnée à la finalité.
        </p>

        <h2 class="h3">7. Transferts hors UE</h2>
        <p>
          DRIVE-IN PRODUCTION ne réalise pas de transfert volontaire hors Union
          Européenne. Des traitements par des prestataires (ex : hébergeur)
          peuvent impliquer des transferts.
        </p>

        <h2 class="h3">8. Cookies et traceurs</h2>
        <p>
          DRIVE-IN PRODUCTION n’utilise <strong>aucun cookie</strong> ni traceur
          (essentiel ou non), et n’utilise aucun outil de mesure d’audience ou
          de publicité.
        </p>

        <h2 class="h3">9. Contenus tiers</h2>
        <p>
          Le site peut intégrer des contenus hébergés par des tiers (par exemple
          des vidéos YouTube). Lorsque vous interagissez avec ces contenus, ces
          tiers peuvent traiter des données vous concernant selon leurs propres
          politiques.
        </p>

        <h2 class="h3">10. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez de droits d’accès, de
          rectification, d’effacement, de limitation, d’opposition et, le cas
          échéant, de portabilité.
        </p>
        <p>
          Pour exercer vos droits : contactez contact@drive-inproduction.com.
          Une preuve d’identité peut être demandée si nécessaire.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL :
          https://www.cnil.fr/fr/plaintes.
        </p>

        <h2 class="h3">11. Mise à jour</h2>
        <p>Dernière mise à jour : 25 Janvier 2026.</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.politique {
  padding: 60px 0 80px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;

  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intro {
  opacity: 0.8;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 18px;
}
</style>
