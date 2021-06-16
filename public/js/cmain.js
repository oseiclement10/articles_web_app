$(document).ready(function(){
    $('.delete-article').on('click',function(event){
        $target = $(event.target);
        const data = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/article/delete/'+ data,
            success:(response)=>{
                alert('deleting article');
                window.location.href='/';
            }, 
            error:err=>console.log(err)
        })
    })
});

