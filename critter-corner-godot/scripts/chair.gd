extends StaticBody2D

@onready var sit_marker: Marker2D = $sitMarker
@onready var label: Label = $Label

var canInteract = false
var isSitting = false

func _ready() -> void:
	label.hide()
	
func _input(event: InputEvent) -> void:
	if not canInteract: return
	
	if Input.is_action_just_pressed("interaction") and not isSitting:
		_sit()
	elif Input.is_action_just_pressed("interaction") and isSitting:
		_release()

func _sit():
	isSitting = true
	
	var player = get_tree().get_first_node_in_group("player")
	
	player.global_position = sit_marker.global_position
	player.sit()
	
	label.hide()

func _release():
	isSitting = false
	
	var player = get_tree().get_first_node_in_group("player")
	player.set_physics_process(true)
	
	#player.global_position = global_position - global_basis.x
	
	label.show()

func _on_area_2d_body_entered(body: Node2D) -> void:
	if body.is_in_group("player"):
		_set_interaction(true)

func _on_area_2d_body_exited(body: Node2D) -> void:
	if body.is_in_group("player"):
		_set_interaction(false)

func _set_interaction(b : bool):
	label.visible = b
	canInteract = b
