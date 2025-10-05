<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>thilla Public Pair Site</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-image: url("https://files.catbox.moe/9a4crg.jpg");
    background-size: cover;
    background-position: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }
  body::before {
    content: "";
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
    background-color: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    z-index:0;
  }
  .container { display:flex; flex-direction:column; align-items:center; z-index:1; }
  .box {
    width: 340px; padding:25px; text-align:center;
    border-radius:18px;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border:1px solid rgba(255,255,255,0.2);
    box-shadow: 0 0 25px rgba(255,0,80,0.4);
    opacity:0; transform: scale(0.5);
    animation: fadeInScale 1s forwards;
    position: relative;
  }
  @keyframes fadeInScale { 0% {opacity:0; transform:scale(0.5);} 100%{opacity:1; transform:scale(1);} }

  h3.centered-text { font-size:20px; margin-bottom:8px; text-shadow:0 0 12px #ff2a6d; color:#fff;}
  h6 { margin-top:0; font-weight:normal; font-size:13px; color:#ddd; }

  .input-container {
    display:flex; margin-top:15px; border-radius:12px; overflow:hidden;
    border:1px solid rgba(255,255,255,0.3);
  }
  .input-container input {
    flex:1; padding:12px;
    background: rgba(0,0,0,0.35);
    border:none; outline:none;
    color:#fff; font-size:14px;
    transition: all 0.3s ease-in-out;
  }
  .input-container input:focus {
    box-shadow: 0 0 10px #00ffe0;
    border:1px solid #00ffe0;
  }
  .input-container input::placeholder { color:#bbb; }

  .input-container button {
    padding:12px;
    background: linear-gradient(135deg, #ff007f, #7f00ff);
    color:#fff; border:none; font-weight:bold; cursor:pointer; transition:0.3s;
  }
  .input-container button:hover { background:linear-gradient(135deg,#00ff94,#00aaff); color:#000; }

  #pair { margin-top:20px; font-size:16px; font-weight:bold; color:#fff; text-shadow:0 0 12px #00ffcc; }
  #countdown {
    font-size:30px; font-weight:bold; margin-top:15px; color:#ff004c; text-shadow:0 0 14px rgba(255,0,0,0.8);
    display:none; transform-origin:center center;
  }
  #copy { cursor:pointer; }

  /* Contact Owner Button */
  .contact-owner {
    margin-top:15px;
    padding:12px 25px;
    font-size:14px;
    font-weight:bold;
    color:#fff;
    border:none;
    border-radius:10px;
    background: linear-gradient(90deg, rgba(0,255,0,0.5) 50%, rgba(0,128,0,1) 50%);
    cursor:pointer;
    transition: 0.3s;
    text-decoration:none;
    display:inline-block;
  }
  .contact-owner:hover {
    background: linear-gradient(90deg, rgba(0,255,128,0.6) 50%, rgba(0,200,0,1) 50%);
    color:#000;
  }

  .footer { margin-top:15px; color:#fff; font-size:12px; text-shadow:0 0 6px #ff00ff; text-align:center; }

  @keyframes shrinkCountdown {
    0% { transform: scale(1); opacity:1; }
    100% { transform: scale(0); opacity:0; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="main">
      <div class="box" id="box">
        <div id="text">
          <i class="fa fa-user" style="font-size:28px;color:#ff4db8"></i>
          <h3 class="centered-text">Link with phone number</h3>
          <h6>⚙ Enter your number with country code ⚙</h6>
          <h6>Creat By Dinuwh Bbh (D.C.M)</h6>
          <div class="input-container">
            <input placeholder="+94767208992" type="number" id="number">
            <button id="submit">ENTER</button>
          </div>
          <main id="pair"></main>
          <div id="countdown">⏳</div>

          
      </div>
    </div>
    <div class="footer">©Admin Thilla SINCE 2025</div>
  </div>

    <!-- Contact Owner Button below box content -->
          <a href="https://wa.me/767208992?text=HEY-THILLA-X-MD-OWNER" target="_blank" class="contact-owner">Contact Owner</a>
        </div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js"></script>
<script>
  let a = document.getElementById("pair");
  let b = document.getElementById("submit");
  let c = document.getElementById("number");
  let countdownEl = document.getElementById("countdown");
  let timer;

  async function Copy() {
    let text = document.getElementById("copy").innerText;
    let obj = document.getElementById("copy");
    await navigator.clipboard.writeText(obj.innerText.replace('CODE: ',''));
    obj.innerText = "COPIED ✅";
    obj.style="color:#00ff94;font-weight:bold";
    setTimeout(()=>{obj.innerText=text; obj.style="color:red;font-weight:bold";},600);
  }

  function startCountdown() {
    countdownEl.style.display="block";
    countdownEl.style.transform="scale(1)";
    countdownEl.innerText="⏳";
    countdownEl.style.opacity=1;
    countdownEl.style.transition="none";
    let timeLeft=60;
    clearInterval(timer);
    timer=setInterval(()=>{
      timeLeft--;
      let scale = timeLeft/60;
      countdownEl.style.transform=`scale(${scale})`;
      countdownEl.style.opacity=scale;
      if(timeLeft<=0){
        clearInterval(timer);
        countdownEl.style.display="none";
      }
    },1000);
  }

  b.addEventListener("click", async (e)=>{
    e.preventDefault();
    if(!c.value){
      a.innerHTML='<span style="color:#ff8080">❗ Enter your whatsapp number with country code.</span>';
    } else if(c.value.replace(/[^0-9]/g,"").length<11){
      a.innerHTML='<span style="color:#ff8080">❌ Invalid number format ❌</span>';
    } else{
      const bc=c.value.replace(/[^0-9]/g,"");
      a.innerHTML='<span style="color:#00ff94">Wait...🗿</span>';
      startCountdown();
      let {data} = await axios(`/code?number=${bc}`);
      let code = data.code || "Service Unavailable";
      a.innerHTML='<font id="copy" onclick="Copy()" style="color:red;font-weight:bold">CODE: <span style="color:#fff;font-weight:bold">'+code+'</span></font>';
      countdownEl.style.display="none";
    }
  });
</script>
</body>
</html>
