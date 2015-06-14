var ref = new Firebase("https://ch-todos.firebaseio.com/");
var todos;

$(document).ready(function() {
  ref.once('value', function(snapshot) {
  	todos = snapshot.val();
    console.log(todos);
	});
	ref.on("child_added", function(snapshot, prevKey) {
	  var newTask = snapshot.val(), key = snapshot.key();
	  addTask(newTask, key);
	});
	var newTodo = $('#task-input');
	$('#add-task').click(function(e) {
		e.preventDefault();
		if (newTodo.val() !== '') {
			ref.push({
				'task': newTodo.val(),
				'done': false
			});
			newTodo.val('');
		} else {
			alert('Enter a task before adding.');
		}
	});
	$('.checkbox').click(function() {
    $(this).parent("li").toggleClass("done");
    var selectedID = $(this).closest('li').attr('id');
    var currentTodo;
    ref.child(selectedID).once('value', function(snapshot) {
    	currentTodo = snapshot.val();
	    console.log(currentTodo);
    });
    // (todos.child(selectedID).done === true ? todos.child(selectedID).done = false : todos.child(selectedID).done = true);
    // console.log(todos[selectedID].done);
	});
	$('#clear-done').click(function(e) {
		e.preventDefault();
		$('.done').each(function(i, e) {
		  ref.child(e.id).remove();
			removeTask(e.id);
		});		
	});
	function addTask(task, key) {
		var newTodoLi = $('.todo-item:last').clone(true).show().attr('id', key);
    newTodoLi.find('.todo-text').text(task.task);
		$('#todo-items').prepend(newTodoLi);
	}
	function removeTask(taskKey) {
		$('#' + taskKey).remove();
	}
});