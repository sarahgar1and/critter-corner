extends CharacterBody2D

const SPEED = 200

var direction : Vector2
var playback : AnimationNodeStateMachinePlayback

@onready var animation_tree: AnimationTree = $AnimationTree

func _ready():
	add_to_group("player")
	playback = animation_tree["parameters/playback"]

func _physics_process(delta: float) -> void:

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	direction = Input.get_vector("left", "right", "up", "down")
	if direction:
		velocity = direction * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.y = move_toward(velocity.y, 0, SPEED)

	move_and_slide()
	select_animation()
	update_animation_parameters()

func select_animation():
	if velocity == Vector2.ZERO:
		playback.travel("Idle")	
	else:
		playback.travel("Walk")

func update_animation_parameters():
	if direction:
		animation_tree["parameters/Idle/blend_position"] = direction
		animation_tree["parameters/Walk/blend_position"] = direction
		animation_tree["parameters/Sit/blend_position"] = direction

func sit():
	set_physics_process(false)
	playback.travel("Sit")
	if OS.has_feature("web"):
		JavaScriptBridge.eval("""window.parent.postMessage({ type: 'AVATAR_SAT_DOWN' }, '*');""")
