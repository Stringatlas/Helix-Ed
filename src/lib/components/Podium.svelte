<script lang="ts">
    export let first: string | undefined;
    export let second: string | undefined;
    export let third: string | undefined;
</script>

<div class="podium-container">
    <div class="podium" data-place="2">
        <div class="medal silver">2</div>
        <div class="team-name">{second}</div>
    </div>

    <div class="podium" data-place="1">
        <div class="medal gold">1</div>
        <div class="team-name">{first}</div>
    </div>

    <div class="podium" data-place="3">
        <div class="medal bronze">3</div>
        <div class="team-name">{third}</div>
    </div>
</div>

<style lang="scss">
    .podium-container {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 300px;
        padding: 20px;
        margin-top: 24px;
    }

    .podium {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 10px;
        width: 100px;
        background-color: rgb(33, 136, 184);
        border-radius: 16px;
        position: relative;
        transition: height 0.8s ease-in-out;
    }

    $animation-time: 1.5s;

    .podium[data-place="1"] {
        height: 100%;
        animation: rise-up1 $animation-time ease-out forwards;
    }

    .podium[data-place="2"] {
        height: 80%;
        animation: rise-up2 $animation-time ease-out forwards;
    }

    .podium[data-place="3"] {
        height: 60%;
        animation: rise-up3 $animation-time ease-out forwards;
    }

    @keyframes rise-up1 {
        from {
            height: 0;
        }
        to {
            height: 100%;
        }
    }

    @keyframes rise-up2 {
        from {
            height: 0;
        }
        to {
            height: 80%;
        }
    }

    @keyframes rise-up3 {
        from {
            height: 0;
        }
        to {
            height: 60%;
        }
    }

    .medal {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: bold;
        font-size: 24px;
        margin-top: 14px;
    }

    .gold {
        background-color: #f9d71c;
        border: 4px solid #d4af37;
    }

    .silver {
        background-color: #c0c0c0;
        border: 4px solid #aaa9ad;
    }

    .bronze {
        background-color: #cd7f32;
        border: 4px solid #b87333;
    }

    .team-name {
        margin-top: 10px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        position: absolute;
        top: -48px;
        opacity: 0;
        animation: fade-in $animation-time ease-in $animation-time forwards;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 100%;
        }
    }
</style>
