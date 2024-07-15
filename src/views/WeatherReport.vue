<script>
import AOS from 'aos'
import 'aos/dist/aos.css'
  export default{
    data(){
      return{
        time:{
          years:'',
          months:'',
          dates:'',
          days:'',
          hours:'',
          mins:'',
          sceonds:'',
          separator:''
        },
        county:{"北部":["新北市","臺北市","桃園市","基隆市","宜蘭縣","新竹市","新竹縣"],
                "中部":["苗栗縣","臺中市","彰化縣","南投縣","雲林縣"],
                "南部":["嘉義縣","嘉義市","臺南市","高雄市","屏東縣"],
                "東部":["花蓮縣","臺東縣"],
                "離島":["澎湖縣","金門縣","連江縣"]},
        weatherList:["新北市","臺北市","基隆市","宜蘭縣","桃園市","新竹市","新竹縣",
                     "苗栗縣","臺中市","彰化縣","南投縣","雲林縣",
                     "嘉義縣","嘉義市","臺南市","高雄市","屏東縣",
                     "花蓮縣","臺東縣",
                     "澎湖縣","金門縣","連江縣"],
        selectedArea:'全臺'
      }
    },
    mounted() {
      AOS.init(),
      this.setTime(),
      setInterval(() => {this.setTime()}, 1000),
      this.getWeatherData()
    },
    watch:{
      selectedArea() {
      this.$nextTick(() => {
        AOS.refresh();
      });
    }
    },
    computed:{
      areaWeather() {
        let filterWeather = (this.selectedArea === "全臺") ? this.weatherList : this.weatherList.filter(county => county.area === this.selectedArea);
        filterWeather = filterWeather.map(area => {
          return {...area,weatherIconNumber: ("0" + area.weatherIconNumber).slice(-2)};
        });
        return filterWeather;
      },
      day_Night(){
        return (this.time.hours > 17 || this.time.hours < 6) ? "night" : "day";
      }
    },
    methods:{
      findRegion(city){
        for (let region in this.county) {
          if (this.county[region].includes(city)) {
          return region;
          }
        }
        return null;
      },
      getWeatherData(){
        fetch('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-C7E3004B-A2E9-4392-8565-09EB9EB71922')
          .then(response =>{
            return response.json()
          })
          .then(data =>{
            let locations = data["records"]["location"];
            locations.forEach(location =>{
              this.weatherList[this.weatherList.indexOf(location["locationName"])] = {
                area:this.findRegion(location["locationName"]),
                city:location["locationName"],
                weather:location["weatherElement"][0]["time"][0]["parameter"]["parameterName"],
                weatherIconNumber:location["weatherElement"][0]["time"][0]["parameter"]["parameterValue"],
                pop:location["weatherElement"][1]["time"][0]["parameter"]["parameterName"],
                MinT:location["weatherElement"][2]["time"][0]["parameter"]["parameterName"],
                CI:location["weatherElement"][3]["time"][0]["parameter"]["parameterName"],
                MaxT:location["weatherElement"][4]["time"][0]["parameter"]["parameterName"]
              };
            });            
          });
      },
      setTime(){
        const now = new Date();
        const dayNames = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        this.time.years = now.getFullYear();
        this.time.months = now.getMonth()+1;
        this.time.dates = now.getDate();
        this.time.days = dayNames[now.getDay()];
        this.time.hours = ("0"+now.getHours()).slice(-2);
        this.time.mins = ("0"+now.getMinutes()).slice(-2);
        this.time.seconds = ("0"+now.getSeconds()).slice(-2);
        this.time.separator = (this.time.seconds% 2 === 0) ? ":" : " ";
      },
    },
    
  }
</script>

<template>
  <div class="w-full min-h-screen bg-gradient-to-t from-teal-100 to-lime-100 flex flex-col justify-start items-center">
    <div
      class="navbar flex flex-wrap items-center justify-center lg:justify-between gap-3 px-10 py-5 bg-amber-100 shadow-xl">
      <h1 class="text-3xl">天氣預報</h1>
      <div class="flex py-2">
        <p class="text-3xl">{{time.years}}&nbsp;年&nbsp;{{time.months}}&nbsp;月&nbsp;{{time.dates}}&nbsp;日&nbsp;{{time.days}}&nbsp;&nbsp;{{time.hours}}{{time.separator}}{{time.mins}}{{time.separator}}{{time.seconds}}</p>
      </div>
      <div class="flex flex-wrap justify-center items-center gap-5 ">
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '全臺'">全臺</button>
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '北部'">北部</button>
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '中部'">中部</button>
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '南部'">南部</button>
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '東部'">東部</button>
        <button
          class="btn bg-gradient-to-tr from-[#86cfff] via-[#6DD5FA] to-[#FFFFFF] hover:bg-[#A0DEFF] border-0 hover:border-none rounded-lg text-2xl font-normal" @click="selectedArea = '離島'">離島</button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 3xl:grid-cols-4 gap-10 py-5">
      <div v-for="(item,index) in areaWeather" :key="index" data-aos="flip-right" data-aos-easing="linear" data-aos-duration="700">
        <div class="card bg-gradient-to-bl from-[#C9D6FF] to-[#FFFFFF] w-[350px] shadow-xl justify-self-center">
          <h2 class="text-center text-2xl mt-5"><i
              class="fa-solid fa-map-location-dot"></i>&nbsp;&nbsp;<span>{{item.city}}</span>
          </h2>
          <div class="flex flex-col justify-center items-center py-2 gap-4">
            <img :src="'https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/'+day_Night+'/'+item.weatherIconNumber+'.svg'" alt=".." class="size-40">
            <p><span>{{item.weather}}</span></p>
          </div>
          <div class="card-body px-4">
            <div class="flex justify-around gap-2">
              <p><i class="fa-solid fa-temperature-full"></i>&nbsp;&nbsp;<span>{{item.MinT}} &deg;C ~ {{item.MaxT}} &deg;C</span></p>
              <p><i class="fa-solid fa-umbrella"></i>&nbsp;&nbsp;<span>{{item.pop}}%</span></p>
              <p><i class="fa-solid fa-seedling"></i>&nbsp;&nbsp;<span>{{item.CI}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>