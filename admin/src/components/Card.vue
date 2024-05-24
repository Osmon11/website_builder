<script setup lang="ts"></script>

<template>
  <div class="card">
    <img
      class="cover-image"
      src="https://img.etimg.com/thumb/msid-82411048,width-210,height-158,imgsize-126848,resizemode-75/dogecoin.jpg"
    />
    <div class="content">
      <h3 class="title">Card title</h3>
      <p class="description">
        Some quick example text to build on the
        card title and make up the bulk of the
        card's content
      </p>
      <button class="button">Button</button>
    </div>
  </div>
</template>

<style scoped>
  .card {
    width: 250px;
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
