<script setup lang="ts">
  import { onMounted, ref } from "vue";

  export interface ICard {
    image_url: string;
    title: string;
    description: string;
  }

  const cardObj = ref<ICard>({
    image_url:
      "https://img.etimg.com/thumb/msid-82411048,width-210,height-158,imgsize-126848,resizemode-75/dogecoin.jpg",
    title: "Card title",
    description:
      "Some quick example text to build on the card title and make up the bulk of the card's content",
  });

  onMounted(() => {
    fetch("http://localhost:8000/data")
      .then((res) => res.json())
      .then((data: { card: ICard }) => {
        if (
          data?.card &&
          typeof data.card.image_url ===
            "string" &&
          typeof data.card.title === "string" &&
          typeof data.card.description ===
            "string"
        ) {
          cardObj.value = data.card;
        }
      });
  });

  // function saveData() {
  //   fetch("http://localhost:8000/data", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(cardObj.value),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if ("message" in data) {
  //         alert(data.message);
  //       }
  //     })
  //     .catch(() => {
  //       alert("Something went wrong");
  //     });
  // }
</script>

<template>
  <div class="card">
    <img
      class="cover-image"
      :src="cardObj.image_url"
    />
    <div class="content">
      <h3 class="title">{{ cardObj.title }}</h3>
      <p class="description">
        {{ cardObj.description }}
      </p>
      <button class="button">Button</button>
    </div>
  </div>
</template>

<style scoped>
  .card {
    min-width: 250px;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    color: black;
  }
  .cover-image {
    width: 100%;
    object-fit: cover;
  }
  .content {
    padding: 12px;
  }
  .description {
    margin-top: 10px;
  }
  .button {
    color: white;
    background-color: purple;
    padding: 10px;
    border-radius: 4px;
    margin-top: 12px;
  }
</style>
