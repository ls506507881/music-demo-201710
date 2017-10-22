$('.tabs').on('click','li',function(e){
    let $li = $(e.currentTarget)//被点击的元素，监听的元素，就是我要的元素
    let index = $li.index() //获取下标
    $li.addClass('active').siblings().removeClass('active') 
    //点击的元素添加active,其他所有邻居移除active
    $('.tab-content').children().eq(index)
       .addClass('active').siblings().removeClass('active')
    //在.tab-content 孩子元素中查找对应的元素，添加active，其他所有邻居元素移除active
  })

//leancloud 获取最新音乐
  let $olSongs = $('ol#songs')
  var query = new AV.Query('Song');
  var cql = 'select * from Song where hot != true';
  AV.Query.doCloudQuery(cql).then(function (data) {
    $('#songs-loading').remove()
        var results = data.results;
        for( var i = 0; i < results.length; i++){
          let song = results[i].attributes
          let li = `
            <li>
            <a href="./song.html?id=${results[i].id}">
              <h3>${song.name}<span>${song.reMark}</span></h3>
              <p><svg class="icon icon-sq" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>${song.singer} - ${song.album}</p>
              <div class="playButton" href="#">
                <svg class="icon icon-play" aria-hidden="true"><use xlink:href="#icon-play"></use></svg>
              </div>
            </a>
            </li>
          `
          $olSongs.append(li)
        }
    }, function (error) {
      console.log('获取最新音乐出错')
    });

// leancloud 获取推荐歌单
  let $olPlaylists = $('ol#playlists')
  var query66 = new AV.Query('Playlist');
  query66.find().then(function (results) {
    for( var i = 0; i < results.length; i++){
      let musicList = results[i].attributes
      let li = `
      <li>
      <a href="./playlist.html?id=${results[i].id}">
            <div class="cover"><img src="${musicList.url}" alt="封面">
              <div class="amount">
                  <svg class="icon icon-listen" aria-hidden="true">
                    <use xlink:href="#icon-listen"></use>
                  </svg>
                <span>${musicList.volume}</span>
              </div>
            </div>
            <p>${musicList.musicListName}</p>
      </a>
      </li>
      `
      $olPlaylists.append(li)
    }
  }, function (error) {
    alert('获取歌单失败')
  });

  // leancloud 获取热门音乐排行
  let $olhotSongs = $('ol#hotsongs')
  var queryhot = new AV.Query('Song');
  var cqltrue = 'select * from Song where hot = true';
  AV.Query.doCloudQuery(cqltrue).then(function (data) {
    var results = data.results;
    // let array = results;
    for( var i = 0; i < results.length; i++){
      let song = results[i].attributes
      if(i<3){
        let li = `
        <li>
          <a href="./song.html?id=${results[i].id}">
            <div class="num hotnum">${[i+1]}</div>
            <h3>${song.name}<span>${song.reMark}</span></h3>
            <p><svg class="icon icon-sq" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>${song.singer} - ${song.album}</p>
            <div class="playButton" href="#">
              <svg class="icon icon-play" aria-hidden="true"><use  xlink:href="#icon-play"></use></svg>
            </div>
          </a>
        </li>
      `
      $olhotSongs.append(li)
      }else{
        let li = `
        <li>
          <a href="./song.html?id=${results[i].id}">
            <div class="num">${[i+1]}</div>
            <h3>${song.name}<span>${song.reMark}</span></h3>
            <p><svg class="icon icon-sq" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>${song.singer} - ${song.album}</p>
            <div class="playButton" href="#">
              <svg class="icon icon-play" aria-hidden="true"><use  xlink:href="#icon-play"></use></svg>
            </div>
          </a>
        </li>
      `
      $olhotSongs.append(li)
      }
    }
  }, function (error) {
    alert('获取热门歌曲失败')
  });

  // leancloud 获取搜索结果
  let timer = null
  $('input#search').on('input',function(e){
    if(timer){window.clearTimeout(timer)}
      timer = setTimeout(function(){
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if(value === ''){return $('#searchResult').empty()}
          var query1 = new AV.Query('Song');
          query1.contains('name',value);
          var query2 = new AV.Query('Song');
          query2.contains('singer',value);
          var query = AV.Query.or(query1, query2);
          query.find().then(function(results){
            $('#searchResult').empty()
            if(results.length===0){
              $('#searchResult').html('没有结果')
            }else{
              for(var i = 0;i<results.length;i++){
                let song = results[i].attributes
                let li = `
                  <li data-id="${results[i].id}">
                      <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-search"></use>
                      </svg>
                    <a href="./song.html?id=${results[i].id}">
                      ${song.name} - ${song.singer}
                    </a>
                  </li>
                `
                $('#searchResult').append(li)
              }
            }
          })
      },400)
    })

    //搜索效果
    var $searchValue = $('#search')
    var $searchCont = $('#searchCont') 
    var $searchContSpan = $('#searchCont > span')
    var holder = $('label.holder')
    var hotSearch = $('section#hotsearch')
    var searchClose = $('#searchclose')
    $($searchValue).on("input", function(){ 
      $searchContSpan.text($searchValue.val())
        holder.addClass('hide');
        $searchCont.removeClass('hide');
        hotSearch.removeClass('actiove').addClass('hide');
        searchClose.removeClass('hide');
        if($searchValue.val().length===0){
          searchEmpty()
        }
    })
    $(searchClose).on("click", function(){
      searchEmpty()
     })
     function searchEmpty(){
      $searchValue.val("");
      holder.removeClass('hide');
      $searchCont.addClass('hide');
      hotSearch.removeClass('hide').addClass('actiove');
      searchClose.addClass('hide');
      $('#searchResult').empty()
     }
