<<<<<<< HEAD
import axios from "axios";
=======
import axios from 'axios';
>>>>>>> origin/master
import qs from 'qs';


export default {
  /*就收数据*/
  req(...params){
    if (params.length===1){
      return axios.get(params[0])
    }
    if (params.length===2) {
      return axios.post(params[0],qs.stringify(params[1]))
    }
  }
}